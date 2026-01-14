import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserDashboardStats, getUserServers } from "@/lib/actions/servers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Server,
	TrendingUp,
	Star,
	Users,
	Activity,
	Eye,
	BarChart3,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function DashboardAnalyticsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/api/auth/signin");
	}

	const [stats, servers] = await Promise.all([
		getUserDashboardStats(),
		getUserServers(),
	]);

	// Calculate additional metrics
	const approvedServers = servers.filter((s) => s.status === "approved");
	const totalMaxPlayers = servers.reduce(
		(sum, s) => sum + (s.maxPlayers || 0),
		0,
	);
	const avgRating =
		servers.reduce(
			(sum, s) => sum + parseFloat(s.averageRating || "0"),
			0,
		) / (servers.length || 1);

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground">
						Analytics Overview
					</h1>
					<p className="text-muted-foreground mt-2">
						Performance metrics across all your servers
					</p>
				</div>

				{/* Overview Stats */}
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
					<Card className="border-border bg-card">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Total Servers
							</CardTitle>
							<Server className="h-4 w-4 text-primary" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-foreground">
								{stats.totalServers}
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								{approvedServers.length} approved,{" "}
								{stats.pendingServers} pending
							</p>
						</CardContent>
					</Card>

					<Card className="border-border bg-card">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Total Votes
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-primary" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-foreground">
								{stats.totalVotes.toLocaleString()}
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Across all servers
							</p>
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
								{avgRating.toFixed(1)}
								<span className="text-sm text-muted-foreground ml-1">/ 5.0</span>
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								{stats.totalReviews} total reviews
							</p>
						</CardContent>
					</Card>

					<Card className="border-border bg-card">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Active Players
							</CardTitle>
							<Users className="h-4 w-4 text-primary" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-foreground">
								{stats.totalPlayers}
								<span className="text-sm text-muted-foreground ml-1">
									/ {totalMaxPlayers}
								</span>
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Currently online
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Server Performance Table */}
				<Card>
					<CardHeader>
						<CardTitle>Server Performance</CardTitle>
					</CardHeader>
					<CardContent>
						{servers.length === 0 ? (
							<div className="text-center py-12">
								<Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
								<h3 className="text-lg font-semibold mb-2">No servers yet</h3>
								<p className="text-muted-foreground mb-4">
									Add your first server to see analytics
								</p>
								<Button asChild>
									<Link href="/dashboard/servers/new">Add Server</Link>
								</Button>
							</div>
						) : (
							<div className="space-y-4">
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b border-border">
												<th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
													Server
												</th>
												<th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
													Status
												</th>
												<th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
													Players
												</th>
												<th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
													Votes
												</th>
												<th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
													Rating
												</th>
												<th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
													Uptime
												</th>
												<th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-border">
											{servers.map((server) => (
												<tr
													key={server.id}
													className="hover:bg-secondary/20 transition-colors"
												>
													<td className="py-4 px-4">
														<div className="flex items-center gap-3">
															{server.logo && (
																<img
																	src={server.logo}
																	alt={server.name}
																	className="h-8 w-8 rounded object-cover"
																/>
															)}
															<div>
																<p className="font-medium text-foreground">
																	{server.name}
																</p>
																<p className="text-xs text-muted-foreground">
																	{server.category}
																</p>
															</div>
														</div>
													</td>
													<td className="py-4 px-4">
														<Badge
															variant={
																server.status === "approved"
																	? "default"
																	: server.status === "pending"
																		? "secondary"
																		: "destructive"
															}
														>
															{server.status}
														</Badge>
													</td>
													<td className="py-4 px-4 text-center">
														<div className="flex items-center justify-center gap-1">
															<Users className="h-4 w-4 text-muted-foreground" />
															<span className="text-sm">
																{server.currentPlayers}/{server.maxPlayers}
															</span>
														</div>
													</td>
													<td className="py-4 px-4 text-center">
														<div className="flex items-center justify-center gap-1">
															<TrendingUp className="h-4 w-4 text-muted-foreground" />
															<span className="text-sm">
																{server.totalVotes}
															</span>
														</div>
													</td>
													<td className="py-4 px-4 text-center">
														<div className="flex items-center justify-center gap-1">
															<Star className="h-4 w-4 text-muted-foreground" />
															<span className="text-sm">
																{parseFloat(server.averageRating).toFixed(1)}
															</span>
														</div>
													</td>
													<td className="py-4 px-4 text-center">
														<div className="flex items-center justify-center gap-1">
															<Activity className="h-4 w-4 text-muted-foreground" />
															<span className="text-sm">
																{server.uptime
																	? `${parseFloat(server.uptime).toFixed(1)}%`
																	: "N/A"}
															</span>
														</div>
													</td>
													<td className="py-4 px-4 text-right">
														<div className="flex items-center justify-end gap-2">
															<Button variant="ghost" size="sm" asChild>
																<Link
																	href={`/dashboard/servers/${server.id}/analytics`}
																>
																	<BarChart3 className="h-4 w-4" />
																</Link>
															</Button>
															{server.status === "approved" && (
																<Button variant="ghost" size="sm" asChild>
																	<Link href={`/server/${server.slug}`}>
																		<Eye className="h-4 w-4" />
																	</Link>
																</Button>
															)}
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Top Performers */}
				{servers.length > 0 && (
					<div className="grid gap-6 md:grid-cols-3 mt-8">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<TrendingUp className="h-5 w-5 text-primary" />
									Most Voted
								</CardTitle>
							</CardHeader>
							<CardContent>
								{[...servers]
									.sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0))
									.slice(0, 3)
									.map((server, index) => (
										<div
											key={server.id}
											className="flex items-center justify-between py-2"
										>
											<div className="flex items-center gap-2">
												<span className="text-lg font-bold text-muted-foreground">
													#{index + 1}
												</span>
												<span className="text-sm font-medium">
													{server.name}
												</span>
											</div>
											<span className="text-sm text-muted-foreground">
												{server.totalVotes} votes
											</span>
										</div>
									))}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Star className="h-5 w-5 text-primary" />
									Highest Rated
								</CardTitle>
							</CardHeader>
							<CardContent>
								{[...servers]
									.sort(
										(a, b) =>
											parseFloat(b.averageRating || "0") -
											parseFloat(a.averageRating || "0"),
									)
									.slice(0, 3)
									.map((server, index) => (
										<div
											key={server.id}
											className="flex items-center justify-between py-2"
										>
											<div className="flex items-center gap-2">
												<span className="text-lg font-bold text-muted-foreground">
													#{index + 1}
												</span>
												<span className="text-sm font-medium">
													{server.name}
												</span>
											</div>
											<span className="text-sm text-muted-foreground">
												{parseFloat(server.averageRating).toFixed(1)} / 5.0
											</span>
										</div>
									))}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Users className="h-5 w-5 text-primary" />
									Most Active
								</CardTitle>
							</CardHeader>
							<CardContent>
								{[...servers]
									.sort(
										(a, b) =>
											(b.currentPlayers || 0) - (a.currentPlayers || 0),
									)
									.slice(0, 3)
									.map((server, index) => (
										<div
											key={server.id}
											className="flex items-center justify-between py-2"
										>
											<div className="flex items-center gap-2">
												<span className="text-lg font-bold text-muted-foreground">
													#{index + 1}
												</span>
												<span className="text-sm font-medium">
													{server.name}
												</span>
											</div>
											<span className="text-sm text-muted-foreground">
												{server.currentPlayers} players
											</span>
										</div>
									))}
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
}
