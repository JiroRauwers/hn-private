import Link from "next/link";
import { Server, Users, MessageSquare, AlertTriangle } from "lucide-react";
import { getPlatformStats } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
	const stats = await getPlatformStats();

	const serverStatusCounts = {
		pending:
			stats.servers.byStatus.find((s) => s.status === "pending")?.count || 0,
		approved:
			stats.servers.byStatus.find((s) => s.status === "approved")?.count || 0,
		rejected:
			stats.servers.byStatus.find((s) => s.status === "rejected")?.count || 0,
		suspended:
			stats.servers.byStatus.find((s) => s.status === "suspended")?.count || 0,
	};

	const userRoleCounts = {
		player: stats.users.byRole.find((u) => u.role === "player")?.count || 0,
		server_owner:
			stats.users.byRole.find((u) => u.role === "server_owner")?.count || 0,
		admin: stats.users.byRole.find((u) => u.role === "admin")?.count || 0,
	};

	const statCards = [
		{
			title: "Total Servers",
			value: stats.servers.total,
			description: `${serverStatusCounts.pending} pending approval`,
			icon: Server,
			color: "text-blue-500",
			href: "/admin/servers",
		},
		{
			title: "Total Users",
			value: stats.users.total,
			description: `${userRoleCounts.admin} admins, ${userRoleCounts.server_owner} owners`,
			icon: Users,
			color: "text-green-500",
			href: "/admin/users",
		},
		{
			title: "Total Reviews",
			value: stats.reviews.total,
			description: "Platform-wide",
			icon: MessageSquare,
			color: "text-purple-500",
			href: "/admin/servers",
		},
		{
			title: "Pending Approval",
			value: serverStatusCounts.pending,
			description: "Requires review",
			icon: AlertTriangle,
			color: "text-orange-500",
			href: "/admin/servers/pending",
		},
	];

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Admin Dashboard</h1>
					<p className="text-muted-foreground">
						Platform statistics and management overview
					</p>
				</div>
				<Button asChild>
					<Link href="/admin/servers/pending">Review Pending Servers</Link>
				</Button>
			</div>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{statCards.map((stat) => {
					const Icon = stat.icon;
					return (
						<Link key={stat.title} href={stat.href}>
							<Card className="hover:border-primary transition-colors cursor-pointer">
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
						</Link>
					);
				})}
			</div>

			{/* Server Status Breakdown */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Server Status</CardTitle>
						<CardDescription>Breakdown by approval status</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Badge variant="default">Approved</Badge>
								<span className="text-sm text-muted-foreground">
									Active servers
								</span>
							</div>
							<span className="font-semibold">{serverStatusCounts.approved}</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Badge variant="secondary">Pending</Badge>
								<span className="text-sm text-muted-foreground">
									Awaiting review
								</span>
							</div>
							<span className="font-semibold">{serverStatusCounts.pending}</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Badge variant="destructive">Rejected</Badge>
								<span className="text-sm text-muted-foreground">
									Denied approval
								</span>
							</div>
							<span className="font-semibold">{serverStatusCounts.rejected}</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Badge variant="outline">Suspended</Badge>
								<span className="text-sm text-muted-foreground">
									Temporarily disabled
								</span>
							</div>
							<span className="font-semibold">
								{serverStatusCounts.suspended}
							</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>User Roles</CardTitle>
						<CardDescription>Breakdown by user role</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Badge variant="default">Admin</Badge>
								<span className="text-sm text-muted-foreground">
									Platform administrators
								</span>
							</div>
							<span className="font-semibold">{userRoleCounts.admin}</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Badge variant="secondary">Server Owner</Badge>
								<span className="text-sm text-muted-foreground">
									Have submitted servers
								</span>
							</div>
							<span className="font-semibold">{userRoleCounts.server_owner}</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Badge variant="outline">Player</Badge>
								<span className="text-sm text-muted-foreground">
									Regular users
								</span>
							</div>
							<span className="font-semibold">{userRoleCounts.player}</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Activity */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Recent Servers</CardTitle>
						<CardDescription>Latest server submissions</CardDescription>
					</CardHeader>
					<CardContent>
						{stats.servers.recent.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-4">
								No servers yet
							</p>
						) : (
							<div className="space-y-3">
								{stats.servers.recent.map((server) => (
									<div
										key={server.id}
										className="flex items-center justify-between p-3 border border-border rounded-lg"
									>
										<div className="flex-1 min-w-0">
											<p className="font-medium truncate">{server.name}</p>
											<p className="text-xs text-muted-foreground">
												{server.category}
											</p>
										</div>
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
								))}
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Users</CardTitle>
						<CardDescription>Latest user registrations</CardDescription>
					</CardHeader>
					<CardContent>
						{stats.users.recent.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-4">
								No users yet
							</p>
						) : (
							<div className="space-y-3">
								{stats.users.recent.map((user) => (
									<div
										key={user.id}
										className="flex items-center justify-between p-3 border border-border rounded-lg"
									>
										<div className="flex-1 min-w-0">
											<p className="font-medium truncate">
												{user.name || "Unknown"}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{user.email}
											</p>
										</div>
										<Badge variant="outline">{user.role}</Badge>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>Common administrative tasks</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 md:grid-cols-3">
					<Button variant="outline" className="h-24 flex-col" asChild>
						<Link href="/admin/servers/pending">
							<AlertTriangle className="h-6 w-6 mb-2" />
							Review Pending
							{serverStatusCounts.pending > 0 && (
								<Badge variant="secondary" className="mt-1">
									{serverStatusCounts.pending}
								</Badge>
							)}
						</Link>
					</Button>
					<Button variant="outline" className="h-24 flex-col" asChild>
						<Link href="/admin/servers">
							<Server className="h-6 w-6 mb-2" />
							Manage Servers
						</Link>
					</Button>
					<Button variant="outline" className="h-24 flex-col" asChild>
						<Link href="/admin/users">
							<Users className="h-6 w-6 mb-2" />
							Manage Users
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
