import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { servers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeaturesManager } from "@/components/dashboard/content/features-manager";
import { StaffManager } from "@/components/dashboard/content/staff-manager";
import { RulesManager } from "@/components/dashboard/content/rules-manager";
import { ActivityManager } from "@/components/dashboard/content/activity-manager";
import { CommunityStatsManager } from "@/components/dashboard/content/community-stats-manager";
import { GalleryManager } from "@/components/dashboard/content/gallery-manager";

export default async function ContentManagementPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/api/auth/signin");
	}

	const serverId = (await params).id;

	// Fetch server and verify ownership
	const server = await db.query.servers.findFirst({
		where: eq(servers.id, serverId),
		with: {
			owner: true,
		},
	});

	if (!server) {
		notFound();
	}

	if (server.ownerId !== session.user.id) {
		redirect("/dashboard/servers");
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground">{server.name}</h1>
					<p className="text-muted-foreground mt-2">
						Manage your server content and information
					</p>
				</div>

				<Tabs defaultValue="features" className="w-full">
					<TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
						<TabsTrigger value="features">Features</TabsTrigger>
						<TabsTrigger value="staff">Staff</TabsTrigger>
						<TabsTrigger value="rules">Rules</TabsTrigger>
						<TabsTrigger value="activity">Activity</TabsTrigger>
						<TabsTrigger value="stats">Stats</TabsTrigger>
						<TabsTrigger value="gallery">Gallery</TabsTrigger>
					</TabsList>

					<TabsContent value="features" className="mt-6">
						<FeaturesManager serverId={serverId} />
					</TabsContent>

					<TabsContent value="staff" className="mt-6">
						<StaffManager serverId={serverId} />
					</TabsContent>

					<TabsContent value="rules" className="mt-6">
						<RulesManager serverId={serverId} />
					</TabsContent>

					<TabsContent value="activity" className="mt-6">
						<ActivityManager serverId={serverId} />
					</TabsContent>

					<TabsContent value="stats" className="mt-6">
						<CommunityStatsManager
							serverId={serverId}
							initialStats={server.communityStats as any}
						/>
					</TabsContent>

					<TabsContent value="gallery" className="mt-6">
						<GalleryManager
							serverId={serverId}
							initialGallery={(server.gallery as string[]) || []}
						/>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
