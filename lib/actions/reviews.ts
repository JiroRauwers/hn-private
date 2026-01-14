"use server";

import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
	reviewHelpful,
	reviewReplies,
	reviews,
	servers,
	users,
} from "@/db/schema";
import { getSession, requireAuth } from "@/lib/auth-utils";
import { reviewSchema } from "@/lib/types/server";

// Create a review
export async function createReview(input: unknown) {
	const session = await requireAuth();
	const validated = reviewSchema.parse(input);

	// Check if server exists and is approved
	const server = await db.query.servers.findFirst({
		where: and(
			eq(servers.id, validated.serverId),
			eq(servers.status, "approved"),
		),
	});

	if (!server) {
		throw new Error("Server not found");
	}

	// Check if user already reviewed this server
	const existingReview = await db.query.reviews.findFirst({
		where: and(
			eq(reviews.serverId, validated.serverId),
			eq(reviews.userId, session.user.id),
		),
	});

	if (existingReview) {
		throw new Error("You have already reviewed this server");
	}

	// Create review
	const [review] = await db
		.insert(reviews)
		.values({
			serverId: validated.serverId,
			userId: session.user.id,
			rating: validated.rating,
			content: validated.content,
		})
		.returning();

	// Recalculate average rating and total reviews
	const allReviews = await db.query.reviews.findMany({
		where: eq(reviews.serverId, validated.serverId),
	});

	const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
	const avgRating = totalRating / allReviews.length;

	await db
		.update(servers)
		.set({
			averageRating: avgRating.toFixed(2),
			totalReviews: allReviews.length,
			updatedAt: new Date(),
		})
		.where(eq(servers.id, validated.serverId));

	revalidatePath(`/server/[slug]`, "page");

	return { success: true, review };
}

// Update a review
export async function updateReview(
	reviewId: string,
	content: string,
	rating: number,
) {
	const session = await requireAuth();

	if (rating < 1 || rating > 5) {
		throw new Error("Rating must be between 1 and 5");
	}

	if (content.length < 20 || content.length > 2000) {
		throw new Error("Review content must be between 20 and 2000 characters");
	}

	// Check if user owns the review
	const review = await db.query.reviews.findFirst({
		where: eq(reviews.id, reviewId),
	});

	if (!review) {
		throw new Error("Review not found");
	}

	if (review.userId !== session.user.id) {
		throw new Error("You can only edit your own reviews");
	}

	// Update review
	const [updated] = await db
		.update(reviews)
		.set({
			content,
			rating,
			updatedAt: new Date(),
		})
		.where(eq(reviews.id, reviewId))
		.returning();

	// Recalculate average rating
	const allReviews = await db.query.reviews.findMany({
		where: eq(reviews.serverId, review.serverId),
	});

	const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
	const avgRating = totalRating / allReviews.length;

	await db
		.update(servers)
		.set({
			averageRating: avgRating.toFixed(2),
			updatedAt: new Date(),
		})
		.where(eq(servers.id, review.serverId));

	revalidatePath(`/server/[slug]`, "page");

	return { success: true, review: updated };
}

// Delete a review
export async function deleteReview(reviewId: string) {
	const session = await requireAuth();

	const review = await db.query.reviews.findFirst({
		where: eq(reviews.id, reviewId),
	});

	if (!review) {
		throw new Error("Review not found");
	}

	if (review.userId !== session.user.id && session.user.role !== "admin") {
		throw new Error("You can only delete your own reviews");
	}

	const serverId = review.serverId;

	// Delete review
	await db.delete(reviews).where(eq(reviews.id, reviewId));

	// Recalculate average rating and total reviews
	const remainingReviews = await db.query.reviews.findMany({
		where: eq(reviews.serverId, serverId),
	});

	const totalRating = remainingReviews.reduce((sum, r) => sum + r.rating, 0);
	const avgRating =
		remainingReviews.length > 0 ? totalRating / remainingReviews.length : 0;

	await db
		.update(servers)
		.set({
			averageRating: avgRating.toFixed(2),
			totalReviews: remainingReviews.length,
			updatedAt: new Date(),
		})
		.where(eq(servers.id, serverId));

	revalidatePath(`/server/[slug]`, "page");

	return { success: true };
}

// Get reviews for a server
export async function getReviews(
	serverId: string,
	sort: "helpful" | "recent" = "helpful",
	limit = 20,
) {
	const orderBy =
		sort === "helpful"
			? [desc(reviews.helpful), desc(reviews.createdAt)]
			: [desc(reviews.createdAt)];

	const serverReviews = await db.query.reviews.findMany({
		where: eq(reviews.serverId, serverId),
		orderBy,
		limit,
		// with: {
		//   user: {
		//     columns: {
		//       id: true,
		//       name: true,
		//       avatar: true,
		//     }
		//   }
		// }
	});

	return serverReviews;
}

// Get user's review for a server (check if they already reviewed)
export async function getUserReview(serverId: string) {
	const session = await getSession();

	if (!session) {
		return null;
	}

	const review = await db.query.reviews.findFirst({
		where: and(
			eq(reviews.serverId, serverId),
			eq(reviews.userId, session.user.id),
		),
	});

	return review;
}

// Mark review as helpful
export async function markReviewHelpful(reviewId: string) {
	const session = await requireAuth();

	// Check if already marked as helpful
	const existing = await db.query.reviewHelpful.findFirst({
		where: and(
			eq(reviewHelpful.reviewId, reviewId),
			eq(reviewHelpful.userId, session.user.id),
		),
	});

	if (existing) {
		// Unmark as helpful (toggle)
		await db
			.delete(reviewHelpful)
			.where(
				and(
					eq(reviewHelpful.reviewId, reviewId),
					eq(reviewHelpful.userId, session.user.id),
				),
			);

		await db
			.update(reviews)
			.set({ helpful: sql`${reviews.helpful} - 1` })
			.where(eq(reviews.id, reviewId));

		revalidatePath(`/server/[slug]`, "page");

		return { success: true, marked: false };
	}

	// Mark as helpful
	await db.insert(reviewHelpful).values({
		reviewId,
		userId: session.user.id,
	});

	await db
		.update(reviews)
		.set({ helpful: sql`${reviews.helpful} + 1` })
		.where(eq(reviews.id, reviewId));

	revalidatePath(`/server/[slug]`, "page");

	return { success: true, marked: true };
}

// Check if user marked review as helpful
export async function hasMarkedHelpful(reviewId: string) {
	const session = await getSession();

	if (!session) {
		return false;
	}

	const marked = await db.query.reviewHelpful.findFirst({
		where: and(
			eq(reviewHelpful.reviewId, reviewId),
			eq(reviewHelpful.userId, session.user.id),
		),
	});

	return !!marked;
}

// Add reply to review (server owner only)
export async function replyToReview(reviewId: string, content: string) {
	const session = await requireAuth();

	if (content.length < 10 || content.length > 1000) {
		throw new Error("Reply must be between 10 and 1000 characters");
	}

	// Get review and check if user owns the server
	const review = await db.query.reviews.findFirst({
		where: eq(reviews.id, reviewId),
		with: {
			server: true,
		},
	});

	if (!review) {
		throw new Error("Review not found");
	}

	if (
		review.server.ownerId !== session.user.id &&
		session.user.role !== "admin"
	) {
		throw new Error("Only the server owner can reply to reviews");
	}

	// Create reply
	const [reply] = await db
		.insert(reviewReplies)
		.values({
			reviewId,
			userId: session.user.id,
			content,
		})
		.returning();

	revalidatePath(`/server/[slug]`, "page");

	return { success: true, reply };
}

// Get replies for a review
export async function getReviewReplies(reviewId: string) {
	const replies = await db.query.reviewReplies.findMany({
		where: eq(reviewReplies.reviewId, reviewId),
		orderBy: [reviews.createdAt],
		with: {
			user: {
				columns: {
					id: true,
					name: true,
					avatar: true,
				},
			},
		},
	});

	return replies;
}
