import { relations } from "drizzle-orm";
import {
	decimal,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { servers } from "./servers";

export const sponsorshipTypeEnum = pgEnum("sponsorship_type", [
	"featured",
	"premium",
	"bump",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
	"pending",
	"succeeded",
	"failed",
	"refunded",
]);

export const sponsorships = pgTable("sponsorships", {
	id: uuid("id").primaryKey().defaultRandom(),
	serverId: uuid("server_id")
		.references(() => servers.id, { onDelete: "cascade" })
		.notNull(),
	userId: text("user_id")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
	type: sponsorshipTypeEnum("type").notNull(),

	// Payment
	amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
	stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
	paymentStatus: paymentStatusEnum("payment_status")
		.default("pending")
		.notNull(),

	// Duration
	startsAt: timestamp("starts_at").notNull(),
	endsAt: timestamp("ends_at").notNull(),

	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sponsorshipsRelations = relations(sponsorships, ({ one }) => ({
	server: one(servers, {
		fields: [sponsorships.serverId],
		references: [servers.id],
	}),
	owner: one(user, {
		fields: [sponsorships.userId],
		references: [user.id],
	}),
}));
