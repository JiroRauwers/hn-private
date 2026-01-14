"use server";

import { db } from "@/db";
import { servers } from "@/db/schema";
import { eq, and, sql, count } from "drizzle-orm";

/**
 * Get public platform statistics for landing page
 * No authentication required
 */
export async function getPlatformStats() {
	// Count approved servers
	const [serverCount] = await db
		.select({ count: count() })
		.from(servers)
		.where(eq(servers.status, "approved"));

	// Sum current players across all approved servers
	const [playersOnline] = await db
		.select({
			total: sql<number>`COALESCE(SUM(${servers.currentPlayers}), 0)`,
		})
		.from(servers)
		.where(and(eq(servers.status, "approved"), eq(servers.isOnline, true)));

	// Get total votes
	const [voteCount] = await db
		.select({
			total: sql<number>`COALESCE(SUM(${servers.totalVotes}), 0)`,
		})
		.from(servers)
		.where(eq(servers.status, "approved"));

	// Get total reviews
	const [reviewCount] = await db
		.select({
			total: sql<number>`COALESCE(SUM(${servers.totalReviews}), 0)`,
		})
		.from(servers)
		.where(eq(servers.status, "approved"));

	return {
		totalServers: serverCount?.count || 0,
		playersOnline: playersOnline?.total || 0,
		totalVotes: voteCount?.total || 0,
		totalReviews: reviewCount?.total || 0,
	};
}
