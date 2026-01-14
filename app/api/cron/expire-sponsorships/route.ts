import { db } from "@/db";
import { sponsorships } from "@/db/schema";
import { and, eq, lt } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Cron Job: Expire Sponsorships
 *
 * This endpoint should be called hourly by a cron job to check for expired sponsorships.
 * While we rely on endsAt timestamp in queries, this logs expired sponsorships for monitoring.
 *
 * Configure in Vercel/hosting:
 * - Schedule: Every hour (0 * * * *)
 * - Endpoint: /api/cron/expire-sponsorships
 * - Authorization: Bearer token with CRON_SECRET
 *
 * Example cron setup (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/expire-sponsorships",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */
export async function GET(req: Request) {
	// Verify cron secret for security
	const authHeader = req.headers.get("authorization");
	const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

	if (!process.env.CRON_SECRET) {
		console.error("CRON_SECRET not configured");
		return NextResponse.json(
			{ error: "Cron secret not configured" },
			{ status: 500 },
		);
	}

	if (authHeader !== expectedAuth) {
		console.error("Unauthorized cron request");
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const now = new Date();

		// Find expired sponsorships that are still marked as succeeded
		const expiredSponsorships = await db.query.sponsorships.findMany({
			where: and(
				lt(sponsorships.endsAt, now),
				eq(sponsorships.paymentStatus, "succeeded"),
			),
			with: {
				server: {
					columns: {
						id: true,
						name: true,
					},
				},
			},
		});

		console.log(
			`[Cron] Found ${expiredSponsorships.length} expired sponsorships`,
		);

		// Log expired sponsorships for monitoring
		if (expiredSponsorships.length > 0) {
			for (const sponsorship of expiredSponsorships) {
				console.log(
					`[Cron] Expired: ${sponsorship.type} sponsorship for server "${sponsorship.server?.name}" (${sponsorship.serverId})`,
				);
			}
		}

		// Note: We don't change the payment status here.
		// Queries already filter by endsAt timestamp to determine active sponsorships.
		// This cron job is primarily for logging and monitoring purposes.

		// Optional: You could update the status to 'expired' if you add that to the enum
		// For now, we rely on timestamp-based filtering in queries

		return NextResponse.json({
			success: true,
			expired: expiredSponsorships.length,
			timestamp: now.toISOString(),
			message: `Processed ${expiredSponsorships.length} expired sponsorships`,
		});
	} catch (error) {
		console.error("[Cron] Error processing expired sponsorships:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to process expired sponsorships",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
