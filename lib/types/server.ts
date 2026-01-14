import { z } from "zod";

// Category enum matching database schema
export const categoryEnum = z.enum([
	"survival",
	"pvp",
	"roleplay",
	"creative",
	"adventure",
	"skyblock",
	"minigames",
]);

// Server creation schema
export const createServerSchema = z.object({
	name: z
		.string()
		.min(3, "Name must be at least 3 characters")
		.max(100, "Name too long"),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(500, "Description too long"),
	longDescription: z.optional(
		z
			.string()
			.min(50, "Long description must be at least 50 characters")
			.max(5000, "Long description too long")
			.or(z.literal("")),
	),
	ip: z.string().min(1, "IP address is required"),
	port: z.optional(z.number().min(1).max(65535)),
	version: z.optional(z.string().max(50)),
	category: categoryEnum,
	tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").default([]),
	maxPlayers: z.optional(z.number().min(1).max(10000)),
	website: z.url("Invalid website URL").or(z.literal("")),
	discord: z.url("Invalid Discord URL").or(z.literal("")),
	establishedDate: z.date().optional(),
	logo: z.string().optional(),
	banner: z.string().optional(),
});

// Server update schema (all fields optional except category)
export const updateServerSchema = createServerSchema.partial();

// Vote schema
export const voteSchema = z.object({
	serverId: z.string().uuid("Invalid server ID"),
	captchaToken: z.string().min(1, "CAPTCHA verification required"),
});

// Review schema
export const reviewSchema = z.object({
	serverId: z.string().uuid("Invalid server ID"),
	rating: z
		.number()
		.min(1, "Rating must be at least 1")
		.max(5, "Rating cannot exceed 5"),
	content: z
		.string()
		.min(20, "Review must be at least 20 characters")
		.max(2000, "Review too long"),
});

// Server filters schema (for getServers function)
export const serverFiltersSchema = z.object({
	category: categoryEnum.optional(),
	search: z.string().optional(),
	sort: z.enum(["players", "votes", "rating", "new"]).optional(),
	limit: z.number().min(1).max(100).default(12),
	offset: z.number().min(0).default(0),
});

// TypeScript types exported from schemas
export type CreateServerInput = z.infer<typeof createServerSchema>;
export type UpdateServerInput = z.infer<typeof updateServerSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ServerFilters = z.infer<typeof serverFiltersSchema>;
export type Category = z.infer<typeof categoryEnum>;
