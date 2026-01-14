import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserProfile } from "@/lib/actions/user";
import { ProfileSettingsForm } from "@/components/dashboard/settings/profile-settings-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Key } from "lucide-react";

export default async function SettingsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/api/auth/signin");
	}

	const userProfile = await getUserProfile();

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground">Settings</h1>
					<p className="text-muted-foreground mt-2">
						Manage your account settings and preferences
					</p>
				</div>

				<Tabs defaultValue="profile" className="w-full">
					<TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
						<TabsTrigger value="profile">
							<User className="h-4 w-4 mr-2" />
							Profile
						</TabsTrigger>
						<TabsTrigger value="notifications" disabled>
							<Bell className="h-4 w-4 mr-2" />
							Notifications
						</TabsTrigger>
						<TabsTrigger value="security" disabled>
							<Shield className="h-4 w-4 mr-2" />
							Security
						</TabsTrigger>
						<TabsTrigger value="api" disabled>
							<Key className="h-4 w-4 mr-2" />
							API Keys
						</TabsTrigger>
					</TabsList>

					<TabsContent value="profile" className="mt-6">
						<ProfileSettingsForm user={userProfile} />
					</TabsContent>

					<TabsContent value="notifications" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Notification Preferences</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									Notification settings coming soon...
								</p>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="security" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Security Settings</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									Security settings coming soon...
								</p>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="api" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>API Keys</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									API key management coming soon...
								</p>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
