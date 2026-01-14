"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Users, MessageCircle, Calendar, Trophy } from "lucide-react";
import { updateCommunityStats } from "@/lib/actions/server-content";

interface CommunityStatsManagerProps {
	serverId: string;
	initialStats: {
		activePlayersCount?: number;
		discordMembersCount?: number;
		eventsHostedCount?: number;
		awardsWonCount?: number;
	};
}

export function CommunityStatsManager({
	serverId,
	initialStats,
}: CommunityStatsManagerProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		activePlayersCount: initialStats?.activePlayersCount || 0,
		discordMembersCount: initialStats?.discordMembersCount || 0,
		eventsHostedCount: initialStats?.eventsHostedCount || 0,
		awardsWonCount: initialStats?.awardsWonCount || 0,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await updateCommunityStats(serverId, formData);
			toast({
				title: "Success",
				description: "Community stats updated successfully",
			});
			router.refresh();
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to update community stats",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold text-foreground">Community Stats</h2>
				<p className="text-muted-foreground mt-1">
					Update your server's community statistics and achievements
				</p>
			</div>

			<form onSubmit={handleSubmit}>
				<Card>
					<CardHeader>
						<CardTitle>Statistics</CardTitle>
						<CardDescription>
							These stats will be displayed in the Community Highlights section
							of your server page
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid gap-6 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="activePlayersCount">
									<div className="flex items-center gap-2">
										<Users className="h-4 w-4 text-primary" />
										Active Players
									</div>
								</Label>
								<Input
									id="activePlayersCount"
									type="number"
									min="0"
									value={formData.activePlayersCount}
									onChange={(e) =>
										setFormData({
											...formData,
											activePlayersCount: parseInt(e.target.value) || 0,
										})
									}
									placeholder="12500"
								/>
								<p className="text-xs text-muted-foreground">
									Total number of active players
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="discordMembersCount">
									<div className="flex items-center gap-2">
										<MessageCircle className="h-4 w-4 text-primary" />
										Discord Members
									</div>
								</Label>
								<Input
									id="discordMembersCount"
									type="number"
									min="0"
									value={formData.discordMembersCount}
									onChange={(e) =>
										setFormData({
											...formData,
											discordMembersCount: parseInt(e.target.value) || 0,
										})
									}
									placeholder="8200"
								/>
								<p className="text-xs text-muted-foreground">
									Total Discord community members
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="eventsHostedCount">
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4 text-primary" />
										Events Hosted
									</div>
								</Label>
								<Input
									id="eventsHostedCount"
									type="number"
									min="0"
									value={formData.eventsHostedCount}
									onChange={(e) =>
										setFormData({
											...formData,
											eventsHostedCount: parseInt(e.target.value) || 0,
										})
									}
									placeholder="156"
								/>
								<p className="text-xs text-muted-foreground">
									Number of events hosted
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="awardsWonCount">
									<div className="flex items-center gap-2">
										<Trophy className="h-4 w-4 text-primary" />
										Awards Won
									</div>
								</Label>
								<Input
									id="awardsWonCount"
									type="number"
									min="0"
									value={formData.awardsWonCount}
									onChange={(e) =>
										setFormData({
											...formData,
											awardsWonCount: parseInt(e.target.value) || 0,
										})
									}
									placeholder="12"
								/>
								<p className="text-xs text-muted-foreground">
									Community awards and achievements
								</p>
							</div>
						</div>

						<div className="flex justify-end">
							<Button type="submit" disabled={loading}>
								<Save className="h-4 w-4 mr-2" />
								{loading ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</CardContent>
				</Card>
			</form>
		</div>
	);
}
