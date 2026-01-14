import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { servers } from "./servers";
import { user } from "./auth-schema";

// Features (gameplay features, highlights)
export const serverFeatures = pgTable("server_features", {
	id: uuid("id").primaryKey().defaultRandom(),
	serverId: uuid("server_id")
		.references(() => servers.id, { onDelete: "cascade" })
		.notNull(),
	title: varchar("title", { length: 100 }).notNull(),
	description: varchar("description", { length: 500 }).notNull(),
	icon: varchar("icon", { length: 50 }).notNull(), // Lucide icon name
	highlight: boolean("highlight").default(false), // Featured feature
	order: integer("order").notNull().default(0), // Display order
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Staff members
export const serverStaff = pgTable("server_staff", {
	id: uuid("id").primaryKey().defaultRandom(),
	serverId: uuid("server_id")
		.references(() => servers.id, { onDelete: "cascade" })
		.notNull(),
	name: varchar("name", { length: 100 }).notNull(),
	role: varchar("role", { length: 50 }).notNull(), // Owner, Admin, Moderator, Builder, etc.
	avatar: varchar("avatar", { length: 500 }), // Avatar URL
	status: varchar("status", { length: 20 }).default("offline"), // online, away, offline
	order: integer("order").notNull().default(0),
	userId: text("user_id").references(() => user.id, { onDelete: "set null" }), // Optional link to actual user
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Server rules
export const serverRules = pgTable("server_rules", {
	id: uuid("id").primaryKey().defaultRandom(),
	serverId: uuid("server_id")
		.references(() => servers.id, { onDelete: "cascade" })
		.notNull(),
	rule: text("rule").notNull(),
	order: integer("order").notNull().default(0),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Recent activity log
export const serverActivities = pgTable("server_activities", {
	id: uuid("id").primaryKey().defaultRandom(),
	serverId: uuid("server_id")
		.references(() => servers.id, { onDelete: "cascade" })
		.notNull(),
	title: varchar("title", { length: 200 }).notNull(),
	description: text("description").notNull(),
	icon: varchar("icon", { length: 50 }).notNull(), // Lucide icon name
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const serverFeaturesRelations = relations(serverFeatures, ({ one }) => ({
	server: one(servers, {
		fields: [serverFeatures.serverId],
		references: [servers.id],
	}),
}));

export const serverStaffRelations = relations(serverStaff, ({ one }) => ({
	server: one(servers, {
		fields: [serverStaff.serverId],
		references: [servers.id],
	}),
	user: one(user, {
		fields: [serverStaff.userId],
		references: [user.id],
	}),
}));

export const serverRulesRelations = relations(serverRules, ({ one }) => ({
	server: one(servers, {
		fields: [serverRules.serverId],
		references: [servers.id],
	}),
}));

export const serverActivitiesRelations = relations(
	serverActivities,
	({ one }) => ({
		server: one(servers, {
			fields: [serverActivities.serverId],
			references: [servers.id],
		}),
	}),
);

// TypeScript types
export type ServerFeature = typeof serverFeatures.$inferSelect;
export type NewServerFeature = typeof serverFeatures.$inferInsert;
export type ServerStaffMember = typeof serverStaff.$inferSelect;
export type NewServerStaffMember = typeof serverStaff.$inferInsert;
export type ServerRule = typeof serverRules.$inferSelect;
export type NewServerRule = typeof serverRules.$inferInsert;
export type ServerActivity = typeof serverActivities.$inferSelect;
export type NewServerActivity = typeof serverActivities.$inferInsert;
