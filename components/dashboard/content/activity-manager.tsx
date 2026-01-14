"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import * as Icons from "lucide-react";
import {
	getServerActivities,
	createServerActivity,
	deleteServerActivity,
} from "@/lib/actions/server-content";
import type { ServerActivity } from "@/db/schema/server-content";
import { formatDistanceToNow } from "date-fns";

interface ActivityManagerProps {
	serverId: string;
}

// Common activity icons
const ACTIVITY_ICONS = [
	"Zap",
	"Trophy",
	"Crown",
	"Gift",
	"Sparkles",
	"Calendar",
	"Users",
	"Megaphone",
	"PartyPopper",
	"Rocket",
	"Star",
	"Flag",
	"Award",
	"Target",
	"Heart",
];

export function ActivityManager({ serverId }: ActivityManagerProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [activities, setActivities] = useState<ServerActivity[]>([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		icon: "Zap",
	});

	useEffect(() => {
		loadActivities();
	}, [serverId]);

	const loadActivities = async () => {
		setLoading(true);
		const data = await getServerActivities(serverId);
		setActivities(data);
		setLoading(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await createServerActivity(serverId, formData);
			toast({
				title: "Success",
				description: "Activity created successfully",
			});

			setOpen(false);
			setFormData({
				title: "",
				description: "",
				icon: "Zap",
			});
			loadActivities();
			router.refresh();
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to create activity",
				variant: "destructive",
			});
		}
	};

	const handleDelete = async (activityId: string) => {
		if (!confirm("Are you sure you want to delete this activity?")) {
			return;
		}

		try {
			await deleteServerActivity(activityId);
			toast({
				title: "Success",
				description: "Activity deleted successfully",
			});
			loadActivities();
			router.refresh();
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to delete activity",
				variant: "destructive",
			});
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-foreground">
						Recent Activity
					</h2>
					<p className="text-muted-foreground mt-1">
						Log important events and announcements for your server
					</p>
				</div>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button
							onClick={() => {
								setFormData({
									title: "",
									description: "",
									icon: "Zap",
								});
							}}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Activity
						</Button>
					</DialogTrigger>
					<DialogContent>
						<form onSubmit={handleSubmit}>
							<DialogHeader>
								<DialogTitle>Add New Activity</DialogTitle>
								<DialogDescription>
									Log a new event or announcement
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4 py-4">
								<div className="space-y-2">
									<Label htmlFor="title">Title</Label>
									<Input
										id="title"
										value={formData.title}
										onChange={(e) =>
											setFormData({ ...formData, title: e.target.value })
										}
										placeholder="Activity title"
										required
										maxLength={200}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
										placeholder="Describe what happened"
										required
										rows={3}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="icon">Icon</Label>
									<Select
										value={formData.icon}
										onValueChange={(value) =>
											setFormData({ ...formData, icon: value })
										}
									>
										<SelectTrigger id="icon">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{ACTIVITY_ICONS.map((iconName) => {
												const IconComponent = (Icons as any)[iconName];
												return (
													<SelectItem key={iconName} value={iconName}>
														<div className="flex items-center gap-2">
															<IconComponent className="h-4 w-4" />
															{iconName}
														</div>
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
								</div>
							</div>
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setOpen(false)}
								>
									Cancel
								</Button>
								<Button type="submit">Create</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{activities.length === 0 ? (
				<Card>
					<CardContent className="p-12">
						<div className="text-center text-muted-foreground">
							No activities logged yet. Click "Add Activity" to get started.
						</div>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Activity Timeline</CardTitle>
						<CardDescription>
							Recent events and announcements ({activities.length} total)
						</CardDescription>
					</CardHeader>
					<CardContent className="p-0">
						<div className="divide-y divide-border">
							{activities.map((activity, index) => {
								const IconComponent =
									(Icons as any)[activity.icon] || Icons.Zap;
								return (
									<div
										key={activity.id}
										className="flex gap-4 items-start p-4 hover:bg-secondary/20 transition-colors group"
									>
										<div className="relative">
											<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
												<IconComponent className="h-5 w-5 text-primary" />
											</div>
											{index < activities.length - 1 && (
												<div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-border" />
											)}
										</div>
										<div className="flex-1 min-w-0 py-0.5">
											<p className="font-medium text-foreground">
												{activity.title}
											</p>
											<p className="text-sm text-muted-foreground mt-0.5">
												{activity.description}
											</p>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-xs text-muted-foreground whitespace-nowrap">
												{formatDistanceToNow(activity.createdAt, {
													addSuffix: true,
												})}
											</span>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleDelete(activity.id)}
												className="opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
