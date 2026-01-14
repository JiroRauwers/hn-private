import {
	boolean,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { servers } from "./servers";

export const reviews = pgTable(
	"reviews",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		serverId: uuid("server_id")
			.references(() => servers.id, { onDelete: "cascade" })
			.notNull(),
		userId: text("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		rating: integer("rating").notNull(), // 1-5
		content: text("content").notNull(),
		helpful: integer("helpful").default(0),
		verified: boolean("verified").default(false), // Verified player badge
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => ({
		serverIdx: index("reviews_server_idx").on(table.serverId),
		userServerIdx: index("reviews_user_server_idx").on(
			table.userId,
			table.serverId,
		),
	}),
);

export const reviewReplies = pgTable("review_replies", {
	id: uuid("id").primaryKey().defaultRandom(),
	reviewId: uuid("review_id")
		.references(() => reviews.id, { onDelete: "cascade" })
		.notNull(),
	userId: text("user_id")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
	content: text("content").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewHelpful = pgTable(
	"review_helpful",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		reviewId: uuid("review_id")
			.references(() => reviews.id, { onDelete: "cascade" })
			.notNull(),
		userId: text("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => ({
		reviewUserIdx: index("review_helpful_review_user_idx").on(
			table.reviewId,
			table.userId,
		),
	}),
);
