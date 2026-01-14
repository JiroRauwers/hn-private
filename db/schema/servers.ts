import { relations } from "drizzle-orm";
import {
	boolean,
	decimal,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const categoryEnum = pgEnum("category", [
	"survival",
	"pvp",
	"roleplay",
	"creative",
	"adventure",
	"skyblock",
	"minigames",
]);

export const statusEnum = pgEnum("status", [
	"pending",
	"approved",
	"rejected",
	"suspended",
]);

export const servers = pgTable("servers", {
	id: uuid("id").primaryKey().defaultRandom(),
	ownerId: text("owner_id")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),

	// Basic Info
	name: varchar("name", { length: 100 }).notNull(),
	slug: varchar("slug", { length: 120 }).unique().notNull(),
	description: varchar("description", { length: 500 }).notNull(),
	longDescription: text("long_description"),

	// Images
	logo: varchar("logo", { length: 500 }),
	banner: varchar("banner", { length: 500 }),
	gallery: jsonb("gallery").$type<string[]>().default([]),

	// Community Stats
	communityStats: jsonb("community_stats")
		.$type<{
			activePlayersCount?: number;
			discordMembersCount?: number;
			eventsHostedCount?: number;
			awardsWonCount?: number;
		}>()
		.default({}),

	// Connection
	ip: varchar("ip", { length: 255 }).notNull(),
	port: integer("port").default(25565),
	version: varchar("version", { length: 50 }),

	// Classification
	category: categoryEnum("category").notNull(),
	tags: jsonb("tags").$type<string[]>().default([]),

	// Stats
	maxPlayers: integer("max_players").default(100),
	currentPlayers: integer("current_players").default(0),
	peakPlayers: integer("peak_players").default(0),
	totalVotes: integer("total_votes").default(0),

	// Ratings
	averageRating: decimal("average_rating", {
		precision: 3,
		scale: 2,
	}).default("0"),
	totalReviews: integer("total_reviews").default(0),

	// Links
	website: varchar("website", { length: 500 }),
	discord: varchar("discord", { length: 500 }),

	// Features
	featured: boolean("featured").default(false),
	sponsored: boolean("sponsored").default(false),

	// Status
	status: statusEnum("status").default("pending").notNull(),
	isOnline: boolean("is_online").default(false),
	lastPing: timestamp("last_ping"),
	uptime: decimal("uptime", { precision: 5, scale: 2 }).default("0"),

	// Timestamps
	establishedDate: timestamp("established_date"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
	approvedAt: timestamp("approved_at"),
});

export const serverStats = pgTable("server_stats", {
	id: uuid("id").primaryKey().defaultRandom(),
	serverId: uuid("server_id")
		.references(() => servers.id, { onDelete: "cascade" })
		.notNull(),
	timestamp: timestamp("timestamp").defaultNow().notNull(),
	playerCount: integer("player_count").notNull(),
	isOnline: boolean("is_online").notNull(),
	responseTime: integer("response_time"), // ms
});

export const serversRelations = relations(servers, ({ one }) => ({
	owner: one(user, {
		fields: [servers.ownerId],
		references: [user.id],
	}),
}));
