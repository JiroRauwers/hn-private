import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ActiveSponsorships } from "@/components/dashboard/active-sponsorships";
import { SponsorshipPackages } from "@/components/dashboard/sponsorship-packages";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getServerById } from "@/lib/actions/servers";
import { getServerSponsorships } from "@/lib/actions/sponsorships";
import { requireAuth } from "@/lib/auth-utils";

export default async function PromoteServerPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const session = await requireAuth();
	const server = await getServerById((await params).id);

	// Verify ownership
	if (
		!server ||
		(server.ownerId !== session.user.id && session.user.role !== "admin")
	) {
		redirect("/dashboard/servers");
	}

	const activeSponsorships = await getServerSponsorships(server.id);

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Back Button */}
				<div className="mb-6">
					<Button variant="ghost" asChild>
						<Link href="/dashboard/servers" className="flex items-center gap-2">
							<ArrowLeft className="h-4 w-4" />
							Back to My Servers
						</Link>
					</Button>
				</div>

				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<Sparkles className="h-8 w-8 text-primary" />
						<h1 className="text-3xl font-bold text-foreground">
							Promote {server.name}
						</h1>
					</div>
					<p className="text-muted-foreground text-lg">
						Boost your server's visibility with sponsorship packages
					</p>
				</div>

				{/* Info Card */}
				<Card className="mb-8 border-primary/20 bg-primary/5">
					<CardContent className="p-6">
						<h3 className="font-semibold text-foreground mb-2">
							Why Sponsor Your Server?
						</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li className="flex items-start gap-2">
								<span className="text-primary">•</span>
								<span>
									Increase visibility and attract more players to your server
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary">•</span>
								<span>
									Stand out from thousands of other servers with enhanced
									styling
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary">•</span>
								<span>
									Boost your server to the top of search results and categories
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary">•</span>
								<span>
									Flexible pricing options to match your budget and goals
								</span>
							</li>
						</ul>
					</CardContent>
				</Card>

				{/* Active Sponsorships */}
				{activeSponsorships.length > 0 && (
					<div className="mb-8">
						<h2 className="text-2xl font-bold text-foreground mb-4">
							Active Sponsorships
						</h2>
						<ActiveSponsorships sponsorships={activeSponsorships} />
					</div>
				)}

				{/* Available Packages */}
				<div>
					<h2 className="text-2xl font-bold text-foreground mb-4">
						Available Packages
					</h2>
					<SponsorshipPackages serverId={server.id} />
				</div>
			</div>
		</div>
	);
}
