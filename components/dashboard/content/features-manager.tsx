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
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import * as Icons from "lucide-react";
import {
	getServerFeatures,
	createServerFeature,
	updateServerFeature,
	deleteServerFeature,
} from "@/lib/actions/server-content";
import type { ServerFeature } from "@/db/schema/server-content";

interface FeaturesManagerProps {
	serverId: string;
}

// Common Lucide icons for server features
const FEATURE_ICONS = [
	"Sparkles",
	"Zap",
	"Trophy",
	"Crown",
	"Gamepad2",
	"Sword",
	"Shield",
	"Gem",
	"Rocket",
	"Heart",
	"Star",
	"Target",
	"Flag",
	"Gift",
	"Award",
];

export function FeaturesManager({ serverId }: FeaturesManagerProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [features, setFeatures] = useState<ServerFeature[]>([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [editingFeature, setEditingFeature] = useState<ServerFeature | null>(
		null,
	);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		icon: "Sparkles",
		highlight: false,
	});

	useEffect(() => {
		loadFeatures();
	}, [serverId]);

	const loadFeatures = async () => {
		setLoading(true);
		const data = await getServerFeatures(serverId);
		setFeatures(data);
		setLoading(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (editingFeature) {
				await updateServerFeature(editingFeature.id, formData);
				toast({
					title: "Success",
					description: "Feature updated successfully",
				});
			} else {
				await createServerFeature(serverId, formData);
				toast({
					title: "Success",
					description: "Feature created successfully",
				});
			}

			setOpen(false);
			setEditingFeature(null);
			setFormData({
				title: "",
				description: "",
				icon: "Sparkles",
				highlight: false,
			});
			loadFeatures();
			router.refresh();
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to save feature",
				variant: "destructive",
			});
		}
	};

	const handleEdit = (feature: ServerFeature) => {
		setEditingFeature(feature);
		setFormData({
			title: feature.title,
			description: feature.description,
			icon: feature.icon,
			highlight: feature.highlight || false,
		});
		setOpen(true);
	};

	const handleDelete = async (featureId: string) => {
		if (!confirm("Are you sure you want to delete this feature?")) {
			return;
		}

		try {
			await deleteServerFeature(featureId);
			toast({
				title: "Success",
				description: "Feature deleted successfully",
			});
			loadFeatures();
			router.refresh();
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to delete feature",
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
						Gameplay Features
					</h2>
					<p className="text-muted-foreground mt-1">
						Manage your server's unique features and highlights
					</p>
				</div>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button
							onClick={() => {
								setEditingFeature(null);
								setFormData({
									title: "",
									description: "",
									icon: "Sparkles",
									highlight: false,
								});
							}}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Feature
						</Button>
					</DialogTrigger>
					<DialogContent>
						<form onSubmit={handleSubmit}>
							<DialogHeader>
								<DialogTitle>
									{editingFeature ? "Edit Feature" : "Add New Feature"}
								</DialogTitle>
								<DialogDescription>
									{editingFeature
										? "Update the feature details below"
										: "Add a new gameplay feature to showcase"}
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
										placeholder="Feature name"
										required
										maxLength={100}
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
										placeholder="Describe this feature"
										required
										maxLength={500}
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
											{FEATURE_ICONS.map((iconName) => {
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
								<Button type="submit">
									{editingFeature ? "Update" : "Create"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{features.length === 0 ? (
				<Card>
					<CardContent className="p-12">
						<div className="text-center text-muted-foreground">
							No features added yet. Click "Add Feature" to get started.
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2">
					{features.map((feature) => {
						const IconComponent =
							(Icons as any)[feature.icon] || Icons.Sparkles;
						return (
							<Card key={feature.id}>
								<CardHeader className="flex flex-row items-start justify-between space-y-0">
									<div className="flex items-start gap-3">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
											<IconComponent className="h-5 w-5 text-primary" />
										</div>
										<div>
											<CardTitle className="text-lg">{feature.title}</CardTitle>
											<CardDescription className="mt-1">
												{feature.description}
											</CardDescription>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleEdit(feature)}
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDelete(feature.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</CardHeader>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
