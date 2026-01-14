import Link from "next/link";
import { Server, TrendingUp, MessageSquare, Users, Sparkles } from "lucide-react";
import { getUserDashboardStats, getUserServers } from "@/lib/actions/servers";
import { getUserSponsorships } from "@/lib/actions/sponsorships";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
	const [stats, recentServers, sponsorships] = await Promise.all([
		getUserDashboardStats(),
		getUserServers(),
		getUserSponsorships(),
	]);

	const recentThree = recentServers.slice(0, 3);

	// Get active sponsorships
	const now = new Date();
	const activeSponsorships = sponsorships.filter(
		(s) =>
			s.paymentStatus === "succeeded" &&
			new Date(s.startsAt) <= now &&
			new Date(s.endsAt) >= now,
	);

	const statCards = [
		{
			title: "Total Servers",
			value: stats.totalServers,
			description: `${stats.pendingServers} pending approval`,
			icon: Server,
			color: "text-blue-500",
		},
		{
			title: "Total Votes",
			value: stats.totalVotes,
			description: "Across all servers",
			icon: TrendingUp,
			color: "text-green-500",
		},
		{
			title: "Total Reviews",
			value: stats.totalReviews,
			description: "Player feedback",
			icon: MessageSquare,
			color: "text-purple-500",
		},
		{
			title: "Active Players",
			value: stats.totalPlayers,
			description: "Currently online",
			icon: Users,
			color: "text-orange-500",
		},
	];

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="text-muted-foreground">
						Manage your servers and track performance
					</p>
				</div>
				<Button asChild>
					<Link href="/dashboard/servers/new">Add New Server</Link>
				</Button>
			</div>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{statCards.map((stat) => {
					const Icon = stat.icon;
					return (
						<Card key={stat.title}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									{stat.title}
								</CardTitle>
								<Icon className={`h-4 w-4 ${stat.color}`} />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stat.value}</div>
								<p className="text-xs text-muted-foreground">
									{stat.description}
								</p>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Recent Servers */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Servers</CardTitle>
					<CardDescription>Your most recently added servers</CardDescription>
				</CardHeader>
				<CardContent>
					{recentThree.length === 0 ? (
						<div className="text-center py-12">
							<Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">No servers yet</h3>
							<p className="text-muted-foreground mb-4">
								Get started by adding your first server
							</p>
							<Button asChild>
								<Link href="/dashboard/servers/new">Add Server</Link>
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							{recentThree.map((server) => (
								<div
									key={server.id}
									className="flex items-center justify-between p-4 border border-border rounded-lg"
								>
									<div className="flex-1">
										<div className="flex items-center gap-3">
											<h4 className="font-semibold">{server.name}</h4>
											<Badge
												variant={
													server.status === "approved"
														? "default"
														: server.status === "pending"
															? "secondary"
															: server.status === "rejected"
																? "destructive"
																: "outline"
												}
											>
												{server.status}
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground line-clamp-1">
											{server.description}
										</p>
										<div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
											<span className="flex items-center gap-1">
												<TrendingUp className="h-4 w-4" />
												{server.totalVotes} votes
											</span>
											<span className="flex items-center gap-1">
												<MessageSquare className="h-4 w-4" />
												{server.totalReviews} reviews
											</span>
											<span className="flex items-center gap-1">
												<Users className="h-4 w-4" />
												{server.currentPlayers}/{server.maxPlayers} players
											</span>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Button variant="outline" size="sm" asChild>
											<Link href={`/dashboard/servers/${server.id}/edit`}>
												Edit
											</Link>
										</Button>
										{server.status === "approved" && (
											<Button variant="outline" size="sm" asChild>
												<Link href={`/server/${server.slug}`}>View</Link>
											</Button>
										)}
									</div>
								</div>
							))}

							{recentServers.length > 3 && (
								<div className="text-center pt-4">
									<Button variant="outline" asChild>
										<Link href="/dashboard/servers">View All Servers</Link>
									</Button>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Active Sponsorships */}
			{activeSponsorships.length > 0 && (
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Sparkles className="h-5 w-5 text-primary" />
								<CardTitle>Active Sponsorships</CardTitle>
							</div>
							<Button variant="outline" size="sm" asChild>
								<Link href="/dashboard/servers">View All</Link>
							</Button>
						</div>
						<CardDescription>
							Your servers with active promotions
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{activeSponsorships.map((sponsorship) => (
								<div
									key={sponsorship.id}
									className="flex items-center justify-between p-3 border border-border rounded-lg"
								>
									<div className="flex items-center gap-3">
										{sponsorship.server?.logo && (
											<img
												src={sponsorship.server.logo}
												alt={sponsorship.server.name}
												className="h-10 w-10 rounded-lg object-cover"
											/>
										)}
										<div>
											<h4 className="font-semibold">
												{sponsorship.server?.name || "Unknown Server"}
											</h4>
											<div className="flex items-center gap-2 mt-1">
												<Badge
													variant={
														sponsorship.type === "featured"
															? "default"
															: sponsorship.type === "premium"
																? "secondary"
																: "outline"
													}
												>
													{sponsorship.type}
												</Badge>
												<span className="text-xs text-muted-foreground">
													Expires{" "}
													{formatDistanceToNow(new Date(sponsorship.endsAt), {
														addSuffix: true,
													})}
												</span>
											</div>
										</div>
									</div>
									<Button variant="outline" size="sm" asChild>
										<Link
											href={`/dashboard/servers/${sponsorship.serverId}/promote`}
										>
											Manage
										</Link>
									</Button>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>Common tasks and shortcuts</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 md:grid-cols-3">
					<Button variant="outline" className="h-24 flex-col" asChild>
						<Link href="/dashboard/servers/new">
							<Server className="h-6 w-6 mb-2" />
							Add New Server
						</Link>
					</Button>
					<Button variant="outline" className="h-24 flex-col" asChild>
						<Link href="/dashboard/servers">
							<Server className="h-6 w-6 mb-2" />
							Manage Servers
						</Link>
					</Button>
					<Button variant="outline" className="h-24 flex-col" asChild>
						<Link href="/dashboard/analytics">
							<TrendingUp className="h-6 w-6 mb-2" />
							View Analytics
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
