"use server";

import { z } from "zod";
import { db } from "@/db";
import { user } from "@/db/schema/auth-schema";
import { requireAuth } from "@/lib/auth-utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const updateProfileSchema = z.object({
	name: z.string().min(1, "Name is required").max(100),
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(30)
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			"Username can only contain letters, numbers, hyphens and underscores",
		)
		.optional()
		.nullable(),
	displayUsername: z.string().max(30).optional().nullable(),
	avatar: z.string().url("Must be a valid URL").optional().nullable(),
});

/**
 * Update user profile information
 */
export async function updateUserProfile(input: unknown) {
	const session = await requireAuth();
	const validated = updateProfileSchema.parse(input);

	// Check if username is already taken (if changing username)
	if (validated.username) {
		const existingUser = await db.query.user.findFirst({
			where: eq(user.username, validated.username),
		});

		if (existingUser && existingUser.id !== session.user.id) {
			throw new Error("Username is already taken");
		}
	}

	// Update user
	await db
		.update(user)
		.set({
			name: validated.name,
			username: validated.username,
			displayUsername: validated.displayUsername,
			avatar: validated.avatar,
			updatedAt: new Date(),
		})
		.where(eq(user.id, session.user.id));

	revalidatePath("/dashboard/settings");

	return { success: true };
}

/**
 * Get current user profile
 */
export async function getUserProfile() {
	const session = await requireAuth();

	const userProfile = await db.query.user.findFirst({
		where: eq(user.id, session.user.id),
		columns: {
			id: true,
			name: true,
			email: true,
			emailVerified: true,
			image: true,
			username: true,
			displayUsername: true,
			role: true,
			avatar: true,
			createdAt: true,
		},
	});

	if (!userProfile) {
		throw new Error("User not found");
	}

	return userProfile;
}
