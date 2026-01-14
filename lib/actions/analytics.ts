"use server";

import { db } from "@/db";
import { servers, serverStats, votes, reviews } from "@/db/schema";
import { requireAuth } from "@/lib/auth-utils";
import { and, eq, gte, sql } from "drizzle-orm";

// Verify ownership helper
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

// Get player count trends over time
export async function getPlayerTrends(serverId: string, days = 30) {
	const session = await requireAuth();
	await verifyServerOwnership(serverId, session.user.id);

	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	const stats = await db.query.serverStats.findMany({
		where: and(
			eq(serverStats.serverId, serverId),
			gte(serverStats.timestamp, startDate),
		),
		orderBy: [serverStats.timestamp],
	});

	// Group by day
	const dailyData = stats.reduce(
		(acc: any, stat) => {
			const day = stat.timestamp.toISOString().split("T")[0];
			if (!acc[day]) {
				acc[day] = { date: day, players: [], count: 0 };
			}
			acc[day].players.push(stat.playerCount);
			acc[day].count++;
			return acc;
		},
		{} as Record<string, { date: string; players: number[]; count: number }>,
	);

	// Calculate daily averages
	const trends = Object.values(dailyData).map((day: any) => ({
		date: day.date,
		players: Math.round(
			day.players.reduce((sum: number, p: number) => sum + p, 0) / day.count,
		),
	}));

	return trends;
}

// Get vote trends
export async function getVoteTrends(serverId: string, days = 30) {
	const session = await requireAuth();
	await verifyServerOwnership(serverId, session.user.id);

	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	const voteData = await db.query.votes.findMany({
		where: and(eq(votes.serverId, serverId), gte(votes.createdAt, startDate)),
		orderBy: [votes.createdAt],
	});

	// Group by day
	const dailyVotes = voteData.reduce(
		(acc: any, vote) => {
			const day = vote.createdAt.toISOString().split("T")[0];
			acc[day] = (acc[day] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	const trends = Object.entries(dailyVotes).map(([date, count]) => ({
		date,
		votes: count as number,
	}));

	return trends;
}

// Get rating distribution
export async function getRatingDistribution(serverId: string) {
	const session = await requireAuth();
	await verifyServerOwnership(serverId, session.user.id);

	const reviewData = await db.query.reviews.findMany({
		where: eq(reviews.serverId, serverId),
		columns: { rating: true },
	});

	const distribution = reviewData.reduce(
		(acc: any, review) => {
			const rating = review.rating.toString();
			acc[rating] = (acc[rating] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	return [1, 2, 3, 4, 5].map((rating) => ({
		rating: `${rating} Star${rating > 1 ? "s" : ""}`,
		count: distribution[rating] || 0,
	}));
}

// Get summary analytics
export async function getAnalyticsSummary(serverId: string) {
	const session = await requireAuth();
	const server = await verifyServerOwnership(serverId, session.user.id);

	return {
		totalVotes: server.totalVotes,
		averageRating: parseFloat(server.averageRating),
		totalReviews: server.totalReviews,
		currentPlayers: server.currentPlayers,
		peakPlayers: server.peakPlayers,
		uptime: parseFloat(server.uptime),
	};
}
