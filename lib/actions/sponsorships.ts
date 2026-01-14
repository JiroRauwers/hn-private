"use server";

import { and, desc, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { servers, sponsorships } from "@/db/schema";
import { requireAuth } from "@/lib/auth-utils";
import { polarClient } from "@/lib/payments";
import {
	type Duration,
	getPriceForSponsorship,
	getProductPriceId,
	SPONSORSHIP_PACKAGES,
	type SponsorshipType,
} from "@/lib/payments/products";

const purchaseSponsorshipSchema = z.object({
	serverId: z.string().uuid(),
	type: z.enum(["featured", "premium", "bump"]),
	duration: z.enum(["daily", "weekly", "monthly", "1h", "3h"]),
});

/**
 * Create a Polar checkout session for sponsorship purchase
 */
export async function createSponsorshipCheckout(input: unknown) {
	const session = await requireAuth();
	const validated = purchaseSponsorshipSchema.parse(input);

	// Verify user owns the server
	const server = await db.query.servers.findFirst({
		where: and(
			eq(servers.id, validated.serverId),
			eq(servers.ownerId, session.user.id),
		),
	});

	if (!server) {
		throw new Error("Server not found or unauthorized");
	}

	// Check if server already has active sponsorship of this type
	const now = new Date();
	const existingSponsorship = await db.query.sponsorships.findFirst({
		where: and(
			eq(sponsorships.serverId, validated.serverId),
			eq(sponsorships.type, validated.type),
			lte(sponsorships.startsAt, now),
			gte(sponsorships.endsAt, now),
			eq(sponsorships.paymentStatus, "succeeded"),
		),
	});

	if (existingSponsorship) {
		throw new Error(
			`Server already has an active ${validated.type} sponsorship`,
		);
	}

	// Get pricing and calculate duration
	const packagePrice = getPriceForSponsorship(
		validated.type,
		validated.duration,
	);
	const { startsAt, endsAt } = calculateDuration(validated.duration);

	// Create pending sponsorship record
	const [sponsorship] = await db
		.insert(sponsorships)
		.values({
			serverId: validated.serverId,
			userId: session.user.id,
			type: validated.type,
			amount: (packagePrice / 100).toFixed(2), // Convert cents to dollars
			paymentStatus: "pending",
			startsAt,
			endsAt,
		})
		.returning();

	// Get product price ID
	const productPriceId = getProductPriceId(validated.type, validated.duration);

	// Create Polar checkout session
	const checkout = await polarClient.checkouts.create({
		products: [productPriceId],
		successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/sponsorships/success?checkout_id={CHECKOUT_ID}`,
		customerEmail: session.user.email,
		customerName: session.user.name || undefined,
		customerMetadata: {
			userId: session.user.id,
			serverId: validated.serverId,
			sponsorshipId: sponsorship.id,
		},
		metadata: {
			sponsorshipId: sponsorship.id,
			serverId: validated.serverId,
			type: validated.type,
			duration: validated.duration,
		},
	});

	// Store Polar checkout ID (reusing stripePaymentIntentId field)
	await db
		.update(sponsorships)
		.set({ stripePaymentIntentId: checkout.id })
		.where(eq(sponsorships.id, sponsorship.id));

	return { checkoutUrl: checkout.url };
}

/**
 * Get active sponsorships for a server
 */
export async function getServerSponsorships(serverId: string) {
	const now = new Date();

	const active = await db.query.sponsorships.findMany({
		where: and(
			eq(sponsorships.serverId, serverId),
			lte(sponsorships.startsAt, now),
			gte(sponsorships.endsAt, now),
			eq(sponsorships.paymentStatus, "succeeded"),
		),
		orderBy: [desc(sponsorships.createdAt)],
	});

	return active;
}

/**
 * Get all sponsorships for a server (including expired and pending)
 */
export async function getAllServerSponsorships(serverId: string) {
	const session = await requireAuth();

	// Verify user owns the server
	const server = await db.query.servers.findFirst({
		where: and(eq(servers.id, serverId), eq(servers.ownerId, session.user.id)),
	});

	if (!server) {
		throw new Error("Server not found or unauthorized");
	}

	const allSponsorships = await db.query.sponsorships.findMany({
		where: eq(sponsorships.serverId, serverId),
		orderBy: [desc(sponsorships.createdAt)],
	});

	return allSponsorships;
}

/**
 * Get user's sponsorship history across all their servers
 */
export async function getUserSponsorships() {
	const session = await requireAuth();

	const history = await db.query.sponsorships.findMany({
		where: eq(sponsorships.userId, session.user.id),
		orderBy: [desc(sponsorships.createdAt)],
		with: {
			server: true,
		},
	});

	return history;
}

/**
 * Check if a server has a specific active sponsorship type
 */
export async function hasActiveSponsorship(
	serverId: string,
	type: SponsorshipType,
): Promise<boolean> {
	const now = new Date();

	const activeSponsorship = await db.query.sponsorships.findFirst({
		where: and(
			eq(sponsorships.serverId, serverId),
			eq(sponsorships.type, type),
			lte(sponsorships.startsAt, now),
			gte(sponsorships.endsAt, now),
			eq(sponsorships.paymentStatus, "succeeded"),
		),
	});

	return !!activeSponsorship;
}

/**
 * Get sponsorship by ID (for confirmation pages)
 */
export async function getSponsorshipById(sponsorshipId: string) {
	const session = await requireAuth();

	const sponsorship = await db.query.sponsorships.findFirst({
		where: and(
			eq(sponsorships.id, sponsorshipId),
			eq(sponsorships.userId, session.user.id),
		),
		with: {
			server: {
				columns: {
					id: true,
					name: true,
					logo: true,
				},
			},
		},
	});

	return sponsorship;
}

// Helper: Calculate duration timestamps
function calculateDuration(duration: Duration): {
	startsAt: Date;
	endsAt: Date;
} {
	const now = new Date();
	const startsAt = new Date(now);
	const endsAt = new Date(now);

	switch (duration) {
		case "daily":
			endsAt.setDate(endsAt.getDate() + 1);
			break;
		case "weekly":
			endsAt.setDate(endsAt.getDate() + 7);
			break;
		case "monthly":
			endsAt.setMonth(endsAt.getMonth() + 1);
			break;
		case "1h":
			endsAt.setHours(endsAt.getHours() + 1);
			break;
		case "3h":
			endsAt.setHours(endsAt.getHours() + 3);
			break;
	}

	return { startsAt, endsAt };
}
