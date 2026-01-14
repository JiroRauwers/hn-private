"use server";

import { and, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { serverStats, servers, sponsorships, users } from "@/db/schema";
import { getSession, requireAuth } from "@/lib/auth-utils";
import {
	createServerSchema,
	type ServerFilters,
	serverFiltersSchema,
	updateServerSchema,
} from "@/lib/types/server";

// Helper function to generate URL-friendly slug
function generateSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

// Create new server (pending approval)
export async function createServer(input: unknown) {
	const session = await requireAuth();
	const validated = createServerSchema.parse(input);

	// Generate unique slug
	let slug = generateSlug(validated.name);
	const slugExists = await db.query.servers.findFirst({
		where: eq(servers.slug, slug),
	});

	// If slug exists, append random string
	if (slugExists) {
		slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
	}

	const [server] = await db
		.insert(servers)
		.values({
			...validated,
			slug,
			ownerId: session.user.id,
			status: "pending",
			tags: validated.tags || [],
			gallery: [],
		})
		.returning();

	revalidatePath("/dashboard/servers");
	return { success: true, server };
}

// Update existing server
export async function updateServer(serverId: string, input: unknown) {
	const session = await requireAuth();
	const validated = updateServerSchema.parse(input);

	// Check ownership
	const server = await db.query.servers.findFirst({
		where: eq(servers.id, serverId),
	});

	if (!server) {
		throw new Error("Server not found");
	}

	if (server.ownerId !== session.user.id && session.user.role !== "admin") {
		throw new Error("Forbidden: You do not own this server");
	}

	// If name changed, regenerate slug
	const updateData: any = { ...validated, updatedAt: new Date() };
	if (validated.name && validated.name !== server.name) {
		updateData.slug = generateSlug(validated.name);
	}

	const [updated] = await db
		.update(servers)
		.set(updateData)
		.where(eq(servers.id, serverId))
		.returning();

	revalidatePath(`/server/${server.slug}`);
	revalidatePath("/dashboard/servers");
	return { success: true, server: updated };
}

// Delete server
export async function deleteServer(serverId: string) {
	const session = await requireAuth();

	const server = await db.query.servers.findFirst({
		where: eq(servers.id, serverId),
	});

	if (!server) {
		throw new Error("Server not found");
	}

	if (server.ownerId !== session.user.id && session.user.role !== "admin") {
		throw new Error("Forbidden: You do not own this server");
	}

	await db.delete(servers).where(eq(servers.id, serverId));

	revalidatePath("/dashboard/servers");
	revalidatePath("/");
	return { success: true };
}

// Get single server by slug (public)
export async function getServerBySlug(slug: string) {
	const server = await db.query.servers.findFirst({
		where: and(eq(servers.slug, slug), eq(servers.status, "approved")),
		with: {
			owner: true,
		},
	});

	return server;
}

// Get single server by ID (for owner/admin)
export async function getServerById(serverId: string) {
	const session = await getSession();

	const server = await db.query.servers.findFirst({
		where: eq(servers.id, serverId),
	});

	if (!server) {
		return null;
	}

	// Only owner or admin can view non-approved servers
	if (server.status !== "approved") {
		if (
			!session ||
			(server.ownerId !== session.user.id && session.user.role !== "admin")
		) {
			return null;
		}
	}

	return server;
}

// Get featured/sponsored servers (prioritize sponsored, then fallback to top voted)
export async function getFeaturedServers() {
	const now = new Date();

	// Find servers with active featured sponsorships
	const sponsoredServerIds = await db
		.select({ serverId: sponsorships.serverId })
		.from(sponsorships)
		.where(
			and(
				eq(sponsorships.type, "featured"),
				lte(sponsorships.startsAt, now),
				gte(sponsorships.endsAt, now),
				eq(sponsorships.paymentStatus, "succeeded"),
			),
		)
		.limit(3);

	const featuredServers = [];

	if (sponsoredServerIds.length > 0) {
		// Get sponsored servers
		const sponsored = await db.query.servers.findMany({
			where: and(
				eq(servers.status, "approved"),
				inArray(
					servers.id,
					sponsoredServerIds.map((s) => s.serverId),
				),
			),
			with: {
				owner: {
					columns: { id: true, name: true },
				},
			},
		});

		featuredServers.push(...sponsored);
	}

	// Fill remaining slots with top voted servers (if needed)
	const remainingSlots = 6 - featuredServers.length;
	if (remainingSlots > 0) {
		const topVoted = await db.query.servers.findMany({
			where: and(
				eq(servers.status, "approved"),
				// Exclude already featured sponsored servers
				sponsoredServerIds.length > 0
					? sql`${servers.id} NOT IN (${sql.join(
							sponsoredServerIds.map((s) => sql`${s.serverId}`),
							sql`, `,
						)})`
					: undefined,
			),
			orderBy: [desc(servers.totalVotes)],
			limit: remainingSlots,
		});

		featuredServers.push(...topVoted);
	}

	return featuredServers;
}

// Get servers with filters and pagination
export async function getServers(filters?: ServerFilters) {
	const validated = serverFiltersSchema.parse(filters || {});

	const conditions: any[] = [eq(servers.status, "approved")];

	// Apply category filter
	if (validated.category) {
		conditions.push(eq(servers.category, validated.category));
	}

	// Apply search filter (search in name and description)
	if (validated.search) {
		conditions.push(
			or(
				ilike(servers.name, `%${validated.search}%`),
				ilike(servers.description, `%${validated.search}%`),
			),
		);
	}

	// Determine sort order
	let orderBy: any;
	switch (validated.sort) {
		case "players":
			orderBy = desc(servers.currentPlayers);
			break;
		case "votes":
			orderBy = desc(servers.totalVotes);
			break;
		case "rating":
			orderBy = desc(servers.averageRating);
			break;
		case "new":
			orderBy = desc(servers.createdAt);
			break;
		default:
			orderBy = desc(servers.totalVotes); // Default to votes
	}

	const serverList = await db.query.servers.findMany({
		where: and(...conditions),
		orderBy: [orderBy],
		limit: validated.limit,
		offset: validated.offset,
	});

	return serverList;
}

// Get user's servers (for dashboard)
export async function getUserServers() {
	const session = await requireAuth();

	const userServers = await db.query.servers.findMany({
		where: eq(servers.ownerId, session.user.id),
		orderBy: [desc(servers.createdAt)],
	});

	return userServers;
}

// Get server statistics (for owner dashboard)
export async function getServerStats(serverId: string) {
	const session = await requireAuth();

	const server = await db.query.servers.findFirst({
		where: eq(servers.id, serverId),
	});

	if (!server) {
		throw new Error("Server not found");
	}

	if (server.ownerId !== session.user.id && session.user.role !== "admin") {
		throw new Error("Forbidden");
	}

	// Get historical stats (last 30 days)
	const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
	const stats = await db.query.serverStats.findMany({
		where: and(
			eq(serverStats.serverId, serverId),
			sql`${serverStats.timestamp} >= ${thirtyDaysAgo}`,
		),
		orderBy: [desc(serverStats.timestamp)],
		limit: 720, // 30 days * 24 hours * 1 ping per hour (if pinging every 5 min, this is ~150 pings)
	});

	return {
		server,
		stats,
		summary: {
			totalVotes: server.totalVotes,
			totalReviews: server.totalReviews,
			averageRating: parseFloat(server.averageRating),
			currentPlayers: server.currentPlayers,
			peakPlayers: server.peakPlayers,
			uptime: parseFloat(server.uptime),
		},
	};
}

// Search servers (more advanced search)
export async function searchServers(query: string, limit = 10) {
	if (!query || query.length < 2) {
		return [];
	}

	const results = await db.query.servers.findMany({
		where: and(
			eq(servers.status, "approved"),
			or(
				ilike(servers.name, `%${query}%`),
				ilike(servers.description, `%${query}%`),
			),
		),
		orderBy: [desc(servers.totalVotes)],
		limit,
	});

	return results;
}

// Get user dashboard statistics
export async function getUserDashboardStats() {
	const session = await requireAuth();

	const userServers = await db.query.servers.findMany({
		where: eq(servers.ownerId, session.user.id),
	});

	const totalVotes = userServers.reduce(
		(sum, server) => sum + (server?.totalVotes || 0),
		0,
	);
	const totalReviews = userServers.reduce(
		(sum, server) => sum + (server?.totalReviews || 0),
		0,
	);
	const totalPlayers = userServers.reduce(
		(sum, server) => sum + (server?.currentPlayers || 0),
		0,
	);

	const stats = {
		totalServers: userServers.length,
		pendingServers: userServers.filter((s) => s.status === "pending").length,
		approvedServers: userServers.filter((s) => s.status === "approved").length,
		rejectedServers: userServers.filter((s) => s.status === "rejected").length,
		suspendedServers: userServers.filter((s) => s.status === "suspended")
			.length,
		totalVotes,
		totalReviews,
		totalPlayers,
	};

	return stats;
}

// Get active sponsorships for multiple servers (for display purposes)
export async function getServersSponsorshipStatus(serverIds: string[]) {
	if (serverIds.length === 0) {
		return {};
	}

	const now = new Date();

	const activeSponsorships = await db.query.sponsorships.findMany({
		where: and(
			inArray(sponsorships.serverId, serverIds),
			lte(sponsorships.startsAt, now),
			gte(sponsorships.endsAt, now),
			eq(sponsorships.paymentStatus, "succeeded"),
		),
	});

	// Create a map of serverId -> sponsorship types
	const sponsorshipMap: Record<
		string,
		{ featured: boolean; premium: boolean; bump: boolean }
	> = {};

	for (const serverId of serverIds) {
		sponsorshipMap[serverId] = { featured: false, premium: false, bump: false };
	}

	for (const sponsorship of activeSponsorships) {
		if (sponsorshipMap[sponsorship.serverId]) {
			sponsorshipMap[sponsorship.serverId][sponsorship.type] = true;
		}
	}

	return sponsorshipMap;
}
