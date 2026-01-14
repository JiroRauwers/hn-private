import Link from "next/link";
import {
	Server,
	Edit,
	Trash2,
	Eye,
	FileEdit,
	BarChart3,
	Megaphone,
} from "lucide-react";
import { getUserServers } from "@/lib/actions/servers";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteServerButton } from "@/components/dashboard/delete-server-button";

export default async function ServersPage() {
	const servers = await getUserServers();

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">My Servers</h1>
					<p className="text-muted-foreground">
						Manage your server listings and monitor their status
					</p>
				</div>
				<Button asChild>
					<Link href="/dashboard/servers/new">Add New Server</Link>
				</Button>
			</div>

			{servers.length === 0 ? (
				<Card>
					<CardContent className="py-12">
						<div className="text-center">
							<Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">No servers yet</h3>
							<p className="text-muted-foreground mb-4">
								Get started by adding your first server to the platform
							</p>
							<Button asChild>
								<Link href="/dashboard/servers/new">Add Your First Server</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{servers.map((server) => (
						<Card key={server.id}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<CardTitle>{server.name}</CardTitle>
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
											{server.featured && (
												<Badge variant="outline" className="bg-yellow-500/10">
													Featured
												</Badge>
											)}
										</div>
										<CardDescription>{server.description}</CardDescription>
									</div>
									<div className="flex flex-wrap items-center gap-2">
										<Button variant="outline" size="sm" asChild>
											<Link href={`/dashboard/servers/${server.id}/edit`}>
												<Edit className="h-4 w-4 mr-2" />
												Edit
											</Link>
										</Button>
										<Button variant="outline" size="sm" asChild>
											<Link href={`/dashboard/servers/${server.id}/content`}>
												<FileEdit className="h-4 w-4 mr-2" />
												Content
											</Link>
										</Button>
										<Button variant="outline" size="sm" asChild>
											<Link href={`/dashboard/servers/${server.id}/analytics`}>
												<BarChart3 className="h-4 w-4 mr-2" />
												Analytics
											</Link>
										</Button>
										<Button variant="outline" size="sm" asChild>
											<Link href={`/dashboard/servers/${server.id}/promote`}>
												<Megaphone className="h-4 w-4 mr-2" />
												Promote
											</Link>
										</Button>
										{server.status === "approved" && (
											<Button variant="outline" size="sm" asChild>
												<Link href={`/server/${server.slug}`}>
													<Eye className="h-4 w-4 mr-2" />
													View
												</Link>
											</Button>
										)}
										<DeleteServerButton serverId={server.id} />
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div>
										<p className="text-sm text-muted-foreground">Players</p>
										<p className="text-lg font-semibold">
											{server.currentPlayers}/{server.maxPlayers}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Total Votes</p>
										<p className="text-lg font-semibold">{server.totalVotes}</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Reviews</p>
										<p className="text-lg font-semibold">
											{server.totalReviews}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Rating</p>
										<p className="text-lg font-semibold">
											{parseFloat(server.averageRating).toFixed(1)} / 5.0
										</p>
									</div>
								</div>

								<div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
									<span>
										<strong>IP:</strong> {server.ip}:{server.port}
									</span>
									<span>
										<strong>Category:</strong> {server.category}
									</span>
									<span>
										<strong>Status:</strong>{" "}
										{server.isOnline ? (
											<span className="text-green-500">Online</span>
										) : (
											<span className="text-red-500">Offline</span>
										)}
									</span>
									{server.uptime && (
										<span>
											<strong>Uptime:</strong> {parseFloat(server.uptime).toFixed(1)}%
										</span>
									)}
								</div>

								{server.status === "rejected" && (
									<div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
										<p className="text-sm text-destructive font-medium">
											This server was rejected. Please review the submission
											guidelines and make necessary changes before resubmitting.
										</p>
									</div>
								)}

								{server.status === "suspended" && (
									<div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-md">
										<p className="text-sm text-orange-500 font-medium">
											This server is currently suspended. Please contact support
											for more information.
										</p>
									</div>
								)}

								{server.status === "pending" && (
									<div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
										<p className="text-sm text-blue-500 font-medium">
											This server is pending approval. Our team will review it
											shortly.
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
