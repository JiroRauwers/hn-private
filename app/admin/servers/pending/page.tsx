import { getPendingServers } from "@/lib/actions/admin";
import { Server, Clock, User, Mail } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApproveRejectButtons } from "@/components/admin/approve-reject-buttons";

export default async function PendingServersPage() {
	const pendingServers = await getPendingServers();

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold">Pending Servers</h1>
				<p className="text-muted-foreground">
					Review and approve server submissions
				</p>
			</div>

			{pendingServers.length === 0 ? (
				<Card>
					<CardContent className="py-12">
						<div className="text-center">
							<Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">No pending servers</h3>
							<p className="text-muted-foreground">
								All server submissions have been reviewed
							</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-6">
					{pendingServers.map((server) => (
						<Card key={server.id}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<CardTitle>{server.name}</CardTitle>
											<Badge variant="secondary">Pending</Badge>
										</div>
										<CardDescription>{server.description}</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Server Details */}
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
									<div>
										<p className="text-sm text-muted-foreground mb-1">Category</p>
										<p className="font-medium capitalize">{server.category}</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground mb-1">IP:Port</p>
										<p className="font-medium font-mono text-sm">
											{server.ip}:{server.port || 25565}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground mb-1">Version</p>
										<p className="font-medium">
											{server.version || "Not specified"}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground mb-1">Max Players</p>
										<p className="font-medium">
											{server.maxPlayers || "Not specified"}
										</p>
									</div>
								</div>

								{/* Long Description */}
								{server.longDescription && (
									<div>
										<h4 className="text-sm font-semibold mb-2">
											Detailed Description
										</h4>
										<p className="text-sm text-muted-foreground whitespace-pre-wrap">
											{server.longDescription}
										</p>
									</div>
								)}

								{/* Tags */}
								{server.tags && server.tags.length > 0 && (
									<div>
										<h4 className="text-sm font-semibold mb-2">Tags</h4>
										<div className="flex flex-wrap gap-2">
											{server.tags.map((tag) => (
												<Badge key={tag} variant="outline">
													{tag}
												</Badge>
											))}
										</div>
									</div>
								)}

								{/* Links */}
								{(server.website || server.discord) && (
									<div>
										<h4 className="text-sm font-semibold mb-2">Links</h4>
										<div className="flex gap-4 text-sm">
											{server.website && (
												<a
													href={server.website}
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary hover:underline"
												>
													Website ↗
												</a>
											)}
											{server.discord && (
												<a
													href={server.discord}
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary hover:underline"
												>
													Discord ↗
												</a>
											)}
										</div>
									</div>
								)}

								{/* Owner Information */}
								<div className="border-t border-border pt-4">
									<h4 className="text-sm font-semibold mb-3">Owner Information</h4>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4 text-muted-foreground" />
											<div>
												<p className="text-xs text-muted-foreground">Name</p>
												<p className="text-sm font-medium">
													{server.owner?.name || "Unknown"}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Mail className="h-4 w-4 text-muted-foreground" />
											<div>
												<p className="text-xs text-muted-foreground">Email</p>
												<p className="text-sm font-medium">
													{server.owner?.email || "Unknown"}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<div>
												<p className="text-xs text-muted-foreground">Submitted</p>
												<p className="text-sm font-medium">
													{new Date(server.createdAt).toLocaleDateString()}
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="border-t border-border pt-4">
									<ApproveRejectButtons serverId={server.id} />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
