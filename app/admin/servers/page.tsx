import Link from "next/link";
import { getAllServers } from "@/lib/actions/admin";
import { Server, Eye } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ServerActionsMenu } from "@/components/admin/server-actions-menu";

export default async function AllServersPage() {
	const servers = await getAllServers(undefined, 100, 0);

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold">All Servers</h1>
				<p className="text-muted-foreground">
					Manage all servers across the platform
				</p>
			</div>

			{servers.length === 0 ? (
				<Card>
					<CardContent className="py-12">
						<div className="text-center">
							<Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">No servers yet</h3>
							<p className="text-muted-foreground">
								Servers will appear here once they are submitted
							</p>
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
											{server.isOnline ? (
												<Badge variant="outline" className="bg-green-500/10">
													Online
												</Badge>
											) : (
												<Badge variant="outline" className="bg-red-500/10">
													Offline
												</Badge>
											)}
										</div>
										<CardDescription>{server.description}</CardDescription>
									</div>
									<div className="flex items-center gap-2">
										{server.status === "approved" && (
											<Button variant="outline" size="sm" asChild>
												<Link href={`/server/${server.slug}`}>
													<Eye className="h-4 w-4 mr-2" />
													View
												</Link>
											</Button>
										)}
										<ServerActionsMenu server={server} />
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
									<div>
										<p className="text-sm text-muted-foreground">Owner</p>
										<p className="text-sm font-medium">
											{server.owner?.name || "Unknown"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Players</p>
										<p className="text-sm font-medium">
											{server.currentPlayers}/{server.maxPlayers}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Votes</p>
										<p className="text-sm font-medium">{server.totalVotes}</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Reviews</p>
										<p className="text-sm font-medium">{server.totalReviews}</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Rating</p>
										<p className="text-sm font-medium">
											{parseFloat(server.averageRating).toFixed(1)} / 5.0
										</p>
									</div>
								</div>

								<div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
									<span>
										<strong>IP:</strong> {server.ip}:{server.port || 25565}
									</span>
									<span>
										<strong>Category:</strong> {server.category}
									</span>
									{server.uptime && (
										<span>
											<strong>Uptime:</strong>{" "}
											{parseFloat(server.uptime).toFixed(1)}%
										</span>
									)}
									<span>
										<strong>Created:</strong>{" "}
										{new Date(server.createdAt).toLocaleDateString()}
									</span>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
