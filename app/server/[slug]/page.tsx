import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Breadcrumb } from "@/components/server-detail/breadcrumb";
import { CommunityHighlights } from "@/components/server-detail/community-highlights";
import { GameplayFeatures } from "@/components/server-detail/gameplay-features";
import { JoinCta } from "@/components/server-detail/join-cta";
import { RecentActivity } from "@/components/server-detail/recent-activity";
import { RelatedServers } from "@/components/server-detail/related-servers";
import { SectionNav } from "@/components/server-detail/section-nav";
import { ServerDetailHero } from "@/components/server-detail/server-detail-hero";
import { ServerOverview } from "@/components/server-detail/server-overview";
import { ServerRules } from "@/components/server-detail/server-rules";
import { ServerSidebar } from "@/components/server-detail/server-sidebar";
import { StaffShowcase } from "@/components/server-detail/staff-showcase";
import { UserReviews } from "@/components/server-detail/user-reviews";
import { getReviews } from "@/lib/actions/reviews";
import { getServerBySlug } from "@/lib/actions/servers";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const server = await getServerBySlug((await params).slug);

	if (!server) {
		return { title: "Server Not Found" };
	}

	return {
		title: `${server.name} - Hytale Server`,
		description: server.description,
	};
}

export default async function ServerDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const server = await getServerBySlug((await params).slug);

	if (!server) {
		notFound();
	}

	const reviews = await getReviews(server.id);

	// Map database server to component expected format
	const serverData = {
		id: server.id,
		name: server.name,
		description: server.description,
		longDescription: server.longDescription || server.description,
		image: server.logo || "/placeholder.svg",
		banner: server.banner || "/placeholder.svg",
		players: {
			online: server.currentPlayers || 0,
			max: server.maxPlayers || 0,
			peak: server.peakPlayers || 0,
		},
		category: server.category,
		rating: server.averageRating ? parseFloat(server.averageRating) : 0,
		totalReviews: server.totalReviews || 0,
		featured: server.featured || false,
		isNew: false, // Calculate based on createdAt if needed
		tags: server.tags as string[],
		owner: server.owner?.name || "Unknown", // From relation
		established:
			server.establishedDate?.toLocaleDateString("en-US", {
				month: "long",
				year: "numeric",
			}) ||
			new Date().toLocaleDateString("en-US", {
				month: "long",
				year: "numeric",
			}),
		discord: server.discord || "",
		website: server.website || "",
		ip: server.ip,
		version: server.version || "Unknown",
		uptime: server.uptime ? parseFloat(server.uptime) : 0,
	};

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<main>
				<Breadcrumb
					serverName={serverData.name}
					category={serverData.category}
				/>

				<ServerDetailHero server={serverData} />

				<SectionNav />

				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="grid gap-8 lg:grid-cols-3">
						<div className="lg:col-span-2 space-y-8">
							<section id="overview">
								<ServerOverview server={serverData} />
							</section>
							<section id="features">
								<GameplayFeatures serverId={server.id} />
							</section>
							<section id="staff">
								<StaffShowcase serverId={server.id} />
							</section>
							<section id="community">
								<CommunityHighlights
									serverId={server.id}
									gallery={server.gallery as string[]}
								/>
							</section>
							<section id="rules">
								<ServerRules serverId={server.id} />
							</section>
							<section id="activity">
								<RecentActivity serverId={server.id} />
							</section>
							<section id="reviews">
								<UserReviews serverId={server.id} initialReviews={reviews} />
							</section>
						</div>
						<div className="lg:col-span-1">
							<ServerSidebar
								server={serverData}
								serverId={server.id}
								totalVotes={server.totalVotes || 0}
							/>
						</div>
					</div>
					<JoinCta
						serverName={serverData.name}
						ip={serverData.ip}
						playersOnline={serverData.players.online}
					/>
					<RelatedServers
						currentServerId={serverData.id}
						category={serverData.category}
					/>
				</div>
			</main>
			<Footer />
		</div>
	);
}
