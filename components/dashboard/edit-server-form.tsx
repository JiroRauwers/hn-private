"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateServerSchema, type UpdateServerInput } from "@/lib/types/server";
import { updateServer } from "@/lib/actions/servers";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { servers } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Server = InferSelectModel<typeof servers>;

const categories = [
	{ value: "survival", label: "Survival" },
	{ value: "pvp", label: "PvP" },
	{ value: "roleplay", label: "Roleplay" },
	{ value: "creative", label: "Creative" },
	{ value: "adventure", label: "Adventure" },
	{ value: "skyblock", label: "Skyblock" },
	{ value: "minigames", label: "Minigames" },
] as const;

export function EditServerForm({ server }: { server: Server }) {
	const router = useRouter();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [tags, setTags] = useState<string>(server.tags.join(", "));

	const form = useForm<UpdateServerInput>({
		resolver: zodResolver(updateServerSchema),
		defaultValues: {
			name: server.name,
			description: server.description,
			longDescription: server.longDescription || "",
			ip: server.ip,
			port: server.port || 25565,
			version: server.version || "",
			category: server.category,
			tags: server.tags,
			maxPlayers: server.maxPlayers || 100,
			website: server.website || "",
			discord: server.discord || "",
		},
	});

	const onSubmit = (data: UpdateServerInput) => {
		startTransition(async () => {
			try {
				// Parse tags from comma-separated string
				const tagArray = tags
					.split(",")
					.map((tag) => tag.trim())
					.filter((tag) => tag.length > 0);

				await updateServer(server.id, {
					...data,
					tags: tagArray,
				});

				toast({
					title: "Server updated!",
					description: "Your server information has been successfully updated.",
				});

				router.push("/dashboard/servers");
			} catch (error) {
				toast({
					title: "Error",
					description:
						error instanceof Error ? error.message : "Failed to update server",
					variant: "destructive",
				});
			}
		});
	};

	return (
		<>
			<Button variant="ghost" size="sm" asChild className="mb-4">
				<Link href="/dashboard/servers">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to Servers
				</Link>
			</Button>

			<Card>
				<CardHeader>
					<CardTitle>Server Information</CardTitle>
					<CardDescription>
						Update your server's details. Changes may require admin approval
						depending on your server's status.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Basic Information */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold">Basic Information</h3>

								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Server Name *</FormLabel>
											<FormControl>
												<Input
													placeholder="My Awesome Server"
													{...field}
													disabled={isPending}
												/>
											</FormControl>
											<FormDescription>
												The display name of your server (3-100 characters)
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Short Description *</FormLabel>
											<FormControl>
												<Textarea
													placeholder="A brief description of your server..."
													className="resize-none"
													rows={3}
													{...field}
													disabled={isPending}
												/>
											</FormControl>
											<FormDescription>
												A short description shown in server cards (10-500
												characters)
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="longDescription"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Long Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="A detailed description of your server, including features, rules, and what makes it unique..."
													className="resize-none"
													rows={6}
													{...field}
													disabled={isPending}
												/>
											</FormControl>
											<FormDescription>
												A detailed description shown on your server's page
												(50-5000 characters)
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="category"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Category *</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												disabled={isPending}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a category" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{categories.map((cat) => (
														<SelectItem key={cat.value} value={cat.value}>
															{cat.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormDescription>
												The primary category of your server
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormItem>
									<FormLabel>Tags</FormLabel>
									<FormControl>
										<Input
											placeholder="PvP, Economy, Custom"
											value={tags}
											onChange={(e) => setTags(e.target.value)}
											disabled={isPending}
										/>
									</FormControl>
									<FormDescription>
										Comma-separated tags (max 10 tags)
									</FormDescription>
								</FormItem>
							</div>

							{/* Connection Details */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold">Connection Details</h3>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="ip"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Server IP *</FormLabel>
												<FormControl>
													<Input
														placeholder="play.myserver.com"
														{...field}
														disabled={isPending}
													/>
												</FormControl>
												<FormDescription>
													Your server's IP address or domain
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="port"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Port</FormLabel>
												<FormControl>
													<Input
														type="number"
														placeholder="25565"
														{...field}
														onChange={(e) =>
															field.onChange(Number(e.target.value))
														}
														disabled={isPending}
													/>
												</FormControl>
												<FormDescription>Server port (default 25565)</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="version"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Version</FormLabel>
												<FormControl>
													<Input
														placeholder="1.20.1"
														{...field}
														disabled={isPending}
													/>
												</FormControl>
												<FormDescription>Game version</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="maxPlayers"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Max Players</FormLabel>
												<FormControl>
													<Input
														type="number"
														placeholder="100"
														{...field}
														onChange={(e) =>
															field.onChange(Number(e.target.value))
														}
														disabled={isPending}
													/>
												</FormControl>
												<FormDescription>Maximum player capacity</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>

							{/* Links */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold">Links</h3>

								<FormField
									control={form.control}
									name="website"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Website</FormLabel>
											<FormControl>
												<Input
													type="url"
													placeholder="https://myserver.com"
													{...field}
													disabled={isPending}
												/>
											</FormControl>
											<FormDescription>Your server's website URL</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="discord"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Discord</FormLabel>
											<FormControl>
												<Input
													type="url"
													placeholder="https://discord.gg/..."
													{...field}
													disabled={isPending}
												/>
											</FormControl>
											<FormDescription>
												Your server's Discord invite link
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="flex items-center gap-4 pt-4">
								<Button type="submit" disabled={isPending}>
									{isPending ? "Saving..." : "Save Changes"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => router.push("/dashboard/servers")}
									disabled={isPending}
								>
									Cancel
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</>
	);
}
