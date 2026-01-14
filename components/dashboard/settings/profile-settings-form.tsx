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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Save, User } from "lucide-react";
import { updateUserProfile } from "@/lib/actions/user";

interface ProfileSettingsFormProps {
	user: {
		id: string;
		name: string;
		email: string;
		emailVerified: boolean;
		image: string | null;
		username: string | null;
		displayUsername: string | null;
		role: string;
		avatar: string | null;
		createdAt: Date;
	};
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: user.name,
		username: user.username || "",
		displayUsername: user.displayUsername || "",
		avatar: user.avatar || user.image || "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await updateUserProfile({
				name: formData.name,
				username: formData.username || null,
				displayUsername: formData.displayUsername || null,
				avatar: formData.avatar || null,
			});

			toast({
				title: "Success",
				description: "Profile updated successfully",
			});

			router.refresh();
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to update profile",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Profile Information</CardTitle>
					<CardDescription>
						Update your profile information and how others see you
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Avatar Preview */}
						<div className="flex items-center gap-6">
							<Avatar className="h-20 w-20">
								<AvatarImage
									src={formData.avatar || user.image || undefined}
								/>
								<AvatarFallback>
									{formData.name.substring(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<Label htmlFor="avatar">Avatar URL</Label>
								<Input
									id="avatar"
									type="url"
									value={formData.avatar}
									onChange={(e) =>
										setFormData({ ...formData, avatar: e.target.value })
									}
									placeholder="https://example.com/avatar.png"
									className="mt-1"
								/>
								<p className="text-xs text-muted-foreground mt-1">
									Provide a URL to your profile picture
								</p>
							</div>
						</div>

						{/* Name */}
						<div className="space-y-2">
							<Label htmlFor="name">
								Display Name <span className="text-destructive">*</span>
							</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								placeholder="Your name"
								required
								maxLength={100}
							/>
							<p className="text-xs text-muted-foreground">
								This is the name that will be displayed across the platform
							</p>
						</div>

						{/* Email (readonly) */}
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={user.email}
								disabled
								className="bg-secondary/50 cursor-not-allowed"
							/>
							<p className="text-xs text-muted-foreground">
								Email cannot be changed. Contact support if you need to update
								it.
							</p>
						</div>

						{/* Username */}
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								value={formData.username}
								onChange={(e) =>
									setFormData({ ...formData, username: e.target.value })
								}
								placeholder="unique-username"
								maxLength={30}
								pattern="[a-zA-Z0-9_-]+"
							/>
							<p className="text-xs text-muted-foreground">
								Unique identifier for your account (letters, numbers, hyphens,
								underscores only)
							</p>
						</div>

						{/* Display Username */}
						<div className="space-y-2">
							<Label htmlFor="displayUsername">Display Username</Label>
							<Input
								id="displayUsername"
								value={formData.displayUsername}
								onChange={(e) =>
									setFormData({
										...formData,
										displayUsername: e.target.value,
									})
								}
								placeholder="How you want your username to appear"
								maxLength={30}
							/>
							<p className="text-xs text-muted-foreground">
								This is how your username will be displayed (can include
								capitals and special characters)
							</p>
						</div>

						<div className="flex items-center justify-between pt-4 border-t">
							<div className="text-sm text-muted-foreground">
								Account created on{" "}
								{new Date(user.createdAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</div>
							<Button type="submit" disabled={loading}>
								<Save className="h-4 w-4 mr-2" />
								{loading ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* Account Info */}
			<Card>
				<CardHeader>
					<CardTitle>Account Information</CardTitle>
					<CardDescription>View your account details and status</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								User ID
							</p>
							<p className="text-sm font-mono mt-1">{user.id}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">Role</p>
							<p className="text-sm mt-1 capitalize">{user.role}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Email Verified
							</p>
							<p className="text-sm mt-1">
								{user.emailVerified ? (
									<span className="text-green-500">Verified</span>
								) : (
									<span className="text-orange-500">Not Verified</span>
								)}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Account Type
							</p>
							<p className="text-sm mt-1">Standard</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
