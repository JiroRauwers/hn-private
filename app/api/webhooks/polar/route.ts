import { db } from "@/db";
import { sponsorships } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { validateEvent } from "@polar-sh/sdk/webhooks";

/**
 * Polar Webhook Handler
 *
 * Handles payment events from Polar to update sponsorship status
 *
 * Configure webhook in Polar dashboard:
 * - URL: https://yourdomain.com/api/webhooks/polar
 * - Events: checkout.created, checkout.updated, order.created
 * - Copy webhook secret to POLAR_WEBHOOK_SECRET env variable
 */
export async function POST(req: Request) {
	const body = await req.text();
	const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

	if (!webhookSecret) {
		console.error("POLAR_WEBHOOK_SECRET not configured");
		return NextResponse.json(
			{ error: "Webhook secret not configured" },
			{ status: 500 },
		);
	}

	let event: any;

	try {
		// Validate webhook signature
		event = validateEvent(body, req.headers, webhookSecret);
	} catch (err) {
		console.error("Polar webhook validation failed:", err);
		return NextResponse.json(
			{ error: "Invalid signature" },
			{ status: 400 },
		);
	}

	try {
		// Handle Polar events
		switch (event.type) {
			case "checkout.created":
				console.log("Checkout created:", event.data.id);
				break;

			case "checkout.updated":
				if (event.data.status === "confirmed") {
					await handleCheckoutConfirmed(event.data);
				} else if (event.data.status === "failed") {
					await handleCheckoutFailed(event.data);
				}
				break;

			case "order.created":
				await handleOrderCreated(event.data);
				break;

			default:
				console.log(`Unhandled Polar event type: ${event.type}`);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("Error processing webhook:", error);
		return NextResponse.json(
			{ error: "Webhook processing failed" },
			{ status: 500 },
		);
	}
}

/**
 * Handle confirmed checkout - mark sponsorship as succeeded
 */
async function handleCheckoutConfirmed(checkout: any) {
	const sponsorshipId =
		checkout.customerMetadata?.sponsorshipId ||
		checkout.metadata?.sponsorshipId;

	if (!sponsorshipId) {
		console.error("No sponsorshipId in checkout metadata");
		return;
	}

	try {
		await db
			.update(sponsorships)
			.set({
				paymentStatus: "succeeded",
				stripePaymentIntentId: checkout.id, // Store Polar checkout ID
			})
			.where(eq(sponsorships.id, sponsorshipId));

		console.log(
			`✅ Sponsorship ${sponsorshipId} payment confirmed via Polar`,
		);
	} catch (error) {
		console.error(
			`Failed to update sponsorship ${sponsorshipId}:`,
			error,
		);
		throw error;
	}
}

/**
 * Handle failed checkout - mark sponsorship as failed
 */
async function handleCheckoutFailed(checkout: any) {
	const sponsorshipId =
		checkout.customerMetadata?.sponsorshipId ||
		checkout.metadata?.sponsorshipId;

	if (!sponsorshipId) {
		return;
	}

	try {
		await db
			.update(sponsorships)
			.set({ paymentStatus: "failed" })
			.where(eq(sponsorships.id, sponsorshipId));

		console.log(
			`❌ Payment failed for sponsorship: ${sponsorshipId}`,
		);
	} catch (error) {
		console.error(
			`Failed to update sponsorship ${sponsorshipId}:`,
			error,
		);
		throw error;
	}
}

/**
 * Handle order created - additional order processing if needed
 */
async function handleOrderCreated(order: any) {
	console.log(`📦 Order created: ${order.id}`);
	// Additional order processing can be added here if needed
}
