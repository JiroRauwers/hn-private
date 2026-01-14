"use server";

import { db } from "@/db";
import {
	serverFeatures,
	serverStaff,
	serverRules,
	serverActivities,
	servers,
} from "@/db/schema";
import { requireAuth } from "@/lib/auth-utils";
import { and, eq, desc } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// ============= HELPERS =============

async function verifyServerOwnership(serverId: string, userId: string) {
	const server = await db.query.servers.findFirst({
		where: eq(servers.id, serverId),
	});

	if (!server) {
		throw new Error("Server not found");
	}

	if (server.ownerId !== userId) {
		throw new Error("Unauthorized: You do not own this server");
	}

	return server;
}

// ============= FEATURES =============

const featureSchema = z.object({
	title: z.string().min(1).max(100),
	description: z.string().min(1).max(500),
	icon: z.string().min(1).max(50),
	highlight: z.boolean().default(false),
});

export async function getServerFeatures(serverId: string) {
	const features = await db.query.serverFeatures.findMany({
		where: eq(serverFeatures.serverId, serverId),
		orderBy: [serverFeatures.order],
	});
	return features;
}

export async function createServerFeature(serverId: string, input: unknown) {
	const session = await requireAuth();
	await verifyServerOwnership(serverId, session.user.id);
	const validated = featureSchema.parse(input);

	const [feature] = await db
		.insert(serverFeatures)
		.values({
			serverId,
			...validated,
			order: 999, // Will be reordered by user
		})
		.returning();

	revalidatePath(`/server/${serverId}`);
	revalidatePath(`/dashboard/servers/${serverId}/content`);
	return feature;
}

export async function updateServerFeature(featureId: string, input: unknown) {
	const session = await requireAuth();
	const validated = featureSchema.parse(input);

	const feature = await db.query.serverFeatures.findFirst({
		where: eq(serverFeatures.id, featureId),
	});

	if (!feature) {
		throw new Error("Feature not found");
	}

	await verifyServerOwnership(feature.serverId, session.user.id);

	const [updated] = await db
		.update(serverFeatures)
		.set({ ...validated, updatedAt: new Date() })
		.where(eq(serverFeatures.id, featureId))
		.returning();

	revalidatePath(`/server/${feature.serverId}`);
	return updated;
}

export async function deleteServerFeature(featureId: string) {
	const session = await requireAuth();

	const feature = await db.query.serverFeatures.findFirst({
		where: eq(serverFeatures.id, featureId),
	});

	if (!feature) {
		throw new Error("Feature not found");
	}

	await verifyServerOwnership(feature.serverId, session.user.id);

	await db.delete(serverFeatures).where(eq(serverFeatures.id, featureId));

	revalidatePath(`/server/${feature.serverId}`);
	return { success: true };
}

export async function reorderServerFeatures(
	serverId: string,
	featureIds: string[],
) {
	const session = await requireAuth();
	await verifyServerOwnership(serverId, session.user.id);

	for (const [index, featureId] of featureIds.entries()) {
		await db
			.update(serverFeatures)
			.set({ order: index })
			.where(eq(serverFeatures.id, featureId));
	}

	revalidatePath(`/server/${serverId}`);
	return { success: true };
}

// ============= STAFF =============

const staffSchema = z.object({
	name: z.string().min(1).max(100),
	role: z.string().min(1).max(50),
	avatar: z.string().url().optional(),
	status: z.enum(["online", "away", "offline"]).default("offline"),
	userId: z.string().optional(),
});

export async function getServerStaff(serverId: string) {
	const staff = await db.query.serverStaff.findMany({
		where: eq(serverStaff.serverId, serverId),
		orderBy: [serverStaff.order],
	});
	return staff;
}

export async function createServerStaff(serverId: string, input: unknown) {
	const session = await requireAuth();
	await verifyServerOwnership(serverId, session.user.id);
	const validated = staffSchema.parse(input);

	const [staff] = await db
		.insert(serverStaff)
		.values({
			serverId,
			...validated,
			order: 999,
		})
		.returning();

	revalidatePath(`/server/${serverId}`);
	return staff;
}

export async function updateServerStaff(staffId: string, input: unknown) {
	const session = await requireAuth();
	const validated = staffSchema.parse(input);

	const staff = await db.query.serverStaff.findFirst({
		where: eq(serverStaff.id, staffId),
	});

	if (!staff) {
		throw new Error("Staff member not found");
	}

	await verifyServerOwnership(staff.serverId, session.user.id);

	const [updated] = await db
		.update(serverStaff)
		.set(validated)
		.where(eq(serverStaff.id, staffId))
		.returning();

	revalidatePath(`/server/${staff.serverId}`);
	return updated;
}

export async function deleteServerStaff(staffId: string) {
	const session = await requireAuth();

	const staff = await db.query.serverStaff.findFirst({
		where: eq(serverStaff.id, staffId),
	});

	if (!staff) {
		throw new Error("Staff member not found");
	}

	await verifyServerOwnership(staff.serverId, session.user.id);

	await db.delete(serverStaff).where(eq(serverStaff.id, staffId));

	revalidatePath(`/server/${staff.serverId}`);
	return { success: true };
}

// ============= RULES =============

const ruleSchema = z.object({
	rule: z.string().min(1).max(500),
});

export async function getServerRules(serverId: string) {
	const rules = await db.query.serverRules.findMany({
		where: eq(serverRules.serverId, serverId),
		orderBy: [serverRules.order],
	});
	return rules;
}

export async function createServerRule(serverId: string, input: unknown) {
	const session = await requireAuth();
	await verifyServerOwnership(serverId, session.user.id);
	const validated = ruleSchema.parse(input);

	const [rule] = await db
		.insert(serverRules)
		.values({
			serverId,
			...validated,
			order: 999,
		})
		.returning();

	revalidatePath(`/server/${serverId}`);
	return rule;
}

export async function updateServerRule(ruleId: string, input: unknown) {
	const session = await requireAuth();
	const validated = ruleSchema.parse(input);

	const rule = await db.query.serverRules.findFirst({
		where: eq(serverRules.id, ruleId),
	});

	if (!rule) {
		throw new Error("Rule not found");
	}

	await verifyServerOwnership(rule.serverId, session.user.id);

	const [updated] = await db
		.update(serverRules)
		.set(validated)
		.where(eq(serverRules.id, ruleId))
		.returning();

	revalidatePath(`/server/${rule.serverId}`);
	return updated;
}

export async function deleteServerRule(ruleId: string) {
	const session = await requireAuth();

	const rule = await db.query.serverRules.findFirst({
		where: eq(serverRules.id, ruleId),
	});

	if (!rule) {
		throw new Error("Rule not found");
	}

	await verifyServerOwnership(rule.serverId, session.user.id);

	await db.delete(serverRules).where(eq(serverRules.id, ruleId));

	revalidatePath(`/server/${rule.serverId}`);
	return { success: true };
}

export async function reorderServerRules(serverId: string, ruleIds: string[]) {
	const session = await requireAuth();
	await verifyServerOwnership(serverId, session.user.id);

	for (const [index, ruleId] of ruleIds.entries()) {
		await db
			.update(serverRules)
			.set({ order: index })
			.where(eq(serverRules.id, ruleId));
	}

	revalidatePath(`/server/${serverId}`);
	return { success: true };
}

// ============= ACTIVITIES =============

const activitySchema = z.object({
	title: z.string().min(1).max(200),
	description: z.string().min(1).max(1000),
	icon: z.string().min(1).max(50),
});

export async function getServerActivities(serverId: string) {
	const activities = await db.query.serverActivities.findMany({
		where: eq(serverActivities.serverId, serverId),
		orderBy: [desc(serverActivities.createdAt)],
		limit: 10,
	});
	return activities;
}

export async function createServerActivity(serverId: string, input: unknown) {
	const session = await requireAuth();
	await verifyServerOwnership(serverId, session.user.id);
	const validated = activitySchema.parse(input);

	const [activity] = await db
		.insert(serverActivities)
		.values({
			serverId,
			...validated,
		})
		.returning();

	revalidatePath(`/server/${serverId}`);
	return activity;
}

export async function deleteServerActivity(activityId: string) {
	const session = await requireAuth();

	const activity = await db.query.serverActivities.findFirst({
		where: eq(serverActivities.id, activityId),
	});

	if (!activity) {
		throw new Error("Activity not found");
	}

	await verifyServerOwnership(activity.serverId, session.user.id);

	await db
		.delete(serverActivities)
		.where(eq(serverActivities.id, activityId));

	revalidatePath(`/server/${activity.serverId}`);
	return { success: true };
}

// ============= COMMUNITY STATS =============

const communityStatsSchema = z.object({
	activePlayersCount: z.number().int().min(0).optional(),
	discordMembersCount: z.number().int().min(0).optional(),
	eventsHostedCount: z.number().int().min(0).optional(),
	awardsWonCount: z.number().int().min(0).optional(),
});

export async function getCommunityStats(serverId: string) {
	const server = await db.query.servers.findFirst({
		where: eq(servers.id, serverId),
		columns: { communityStats: true },
	});

	return server?.communityStats || {};
}

export async function updateCommunityStats(serverId: string, input: unknown) {
	const session = await requireAuth();
	await verifyServerOwnership(serverId, session.user.id);
	const validated = communityStatsSchema.parse(input);

	await db
		.update(servers)
		.set({ communityStats: validated })
		.where(eq(servers.id, serverId));

	revalidatePath(`/server/${serverId}`);
	return { success: true };
}

// ============= GALLERY =============

const gallerySchema = z.object({
	gallery: z.array(z.string().url()).max(10),
});

export async function updateServerGallery(serverId: string, input: unknown) {
	const session = await requireAuth();
	await verifyServerOwnership(serverId, session.user.id);
	const validated = gallerySchema.parse(input);

	await db
		.update(servers)
		.set({ gallery: validated.gallery })
		.where(eq(servers.id, serverId));

	revalidatePath(`/server/${serverId}`);
	return { success: true };
}
