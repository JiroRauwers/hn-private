import {
	index,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { servers } from "./servers";

export const votes = pgTable(
	"votes",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		serverId: uuid("server_id")
			.references(() => servers.id, { onDelete: "cascade" })
			.notNull(),
		userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
		ipAddress: varchar("ip_address", { length: 45 }), // Support IPv6
		userAgent: varchar("user_agent", { length: 500 }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => ({
		serverUserIdx: index("votes_server_user_idx").on(
			table.serverId,
			table.userId,
		),
		serverIpIdx: index("votes_server_ip_idx").on(
			table.serverId,
			table.ipAddress,
		),
	}),
);
