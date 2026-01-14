import { checkout, polar, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { lastLoginMethod, username } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { polarClient } from "./payments";
import { sendVerificationEmail } from "./email";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			// Extract token from the verification URL
			const token = new URL(url).searchParams.get("token");
			if (token) {
				await sendVerificationEmail(user.email, token);
			}
		},
	},

	socialProviders: {
		discord: {
			clientId: process.env.DISCORD_CLIENT_ID || "",
			clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
			enabled: !!process.env.DISCORD_CLIENT_ID,
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
			enabled: !!process.env.GOOGLE_CLIENT_ID,
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID || "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
			enabled: !!process.env.GITHUB_CLIENT_ID,
		},
		microsoft: {
			clientId: process.env.MICROSOFT_CLIENT_ID || "",
			clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
			enabled: !!process.env.MICROSOFT_CLIENT_ID,
		},
	},

	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
		cookieCache: {
			enabled: true,
			maxAge: 10 * 60, // Cache duration in seconds (5 minutes)
		},
	},

	plugins: [
		nextCookies(),
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			enableCustomerPortal: true,
			use: [
				checkout({
					products: [
						{
							productId: "your-product-id",
							slug: "pro",
						},
					],
					successUrl: process.env.POLAR_SUCCESS_URL,
					authenticatedUsersOnly: true,
				}),
				portal(),
			],
		}),
		username(),
		lastLoginMethod(),
	],
});

export type Session = typeof auth.$Infer.Session;
