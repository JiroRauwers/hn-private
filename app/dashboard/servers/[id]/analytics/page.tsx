import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { servers } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
	getAnalyticsSummary,
	getPlayerTrends,
	getVoteTrends,
	getRatingDistribution,
} from "@/lib/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerTrendChart } from "@/components/dashboard/analytics/player-trend-chart";
import { VoteTrendChart } from "@/components/dashboard/analytics/vote-trend-chart";
import { RatingDistributionChart } from "@/components/dashboard/analytics/rating-distribution-chart";
import { ThumbsUp, Star, Users, Activity } from "lucide-react";

export default async function AnalyticsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/api/auth/signin");
	}

	const serverId = (await params).id;

	// Fetch server and verify ownership
	const server = await db.query.servers.findFirst({
		where: eq(servers.id, serverId),
		with: {
			owner: true,
		},
	});

	if (!server) {
		notFound();
	}

	if (server.ownerId !== session.user.id) {
		redirect("/dashboard/servers");
	}

	// Fetch analytics data
	const [summary, playerTrends, voteTrends, ratingDistribution] =
		await Promise.all([
			getAnalyticsSummary(serverId),
			getPlayerTrends(serverId, 30),
			getVoteTrends(serverId, 30),
			getRatingDistribution(serverId),
		]);

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground">{server.name}</h1>
					<p className="text-muted-foreground mt-2">
						Analytics and performance metrics
					</p>
				</div>

				{/* Summary Cards */}
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
					<Card className="border-border bg-card">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Total Votes
							</CardTitle>
							<ThumbsUp className="h-4 w-4 text-primary" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-foreground">
								{summary.totalVotes.toLocaleString()}
							</div>
						</CardContent>
					</Card>

					<Card className="border-border bg-card">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Average Rating
							</CardTitle>
							<Star className="h-4 w-4 text-primary" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-foreground">
								{summary.averageRating.toFixed(1)}
								<span className="text-sm text-muted-foreground ml-1">/ 5.0</span>
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								{summary.totalReviews} review{summary.totalReviews !== 1 ? "s" : ""}
							</p>
						</CardContent>
					</Card>

					<Card className="border-border bg-card">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Current Players
							</CardTitle>
							<Users className="h-4 w-4 text-primary" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-foreground">
								{summary.currentPlayers}
								<span className="text-sm text-muted-foreground ml-1">
									/ {server.maxPlayers || 0}
								</span>
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Peak: {summary.peakPlayers}
							</p>
						</CardContent>
					</Card>

					<Card className="border-border bg-card">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Uptime
							</CardTitle>
							<Activity className="h-4 w-4 text-primary" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-foreground">
								{summary.uptime.toFixed(1)}%
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Last 30 days
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Charts */}
				<div className="grid gap-6 lg:grid-cols-2 mb-8">
					<PlayerTrendChart data={playerTrends} />
					<VoteTrendChart data={voteTrends} />
				</div>

				<div className="grid gap-6">
					<RatingDistributionChart data={ratingDistribution} />
				</div>
			</div>
		</div>
	);
}
