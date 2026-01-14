import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";
import { ServerCard } from "@/components/server-card";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { servers } from "@/db/schema";
import { and, eq, ne, desc } from "drizzle-orm";

interface RelatedServersProps {
	currentServerId: string;
	category: string;
}

export async function RelatedServers({
	currentServerId,
	category,
}: RelatedServersProps) {
	const relatedServers = await db.query.servers.findMany({
		where: and(
			eq(servers.status, "approved"),
			eq(servers.category, category),
			ne(servers.id, currentServerId),
		),
		orderBy: [desc(servers.totalVotes)],
		limit: 3,
	});

	if (relatedServers.length === 0) {
		return null; // Don't render if no related servers
	}

	return (
		<section className="mt-16 pb-8">
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
						<Compass className="h-5 w-5 text-primary" />
					</div>
					<div>
						<h2 className="text-xl font-bold text-foreground">
							Discover Similar Servers
						</h2>
						<p className="text-sm text-muted-foreground">
							More servers in {category}
						</p>
					</div>
				</div>
				<Link href={`/?category=${category.toLowerCase()}`}>
					<Button
						variant="ghost"
						className="text-muted-foreground hover:text-primary group"
					>
						Browse All
						<ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
					</Button>
				</Link>
			</div>

			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{relatedServers.map((server) => (
					<ServerCard
						key={server.id}
						server={{
							id: server.id,
							name: server.name,
							description: server.description,
							image: server.logo,
							players: { online: server.currentPlayers, max: server.maxPlayers },
							category: server.category,
							rating: parseFloat(server.averageRating),
							tags: server.tags,
							slug: server.slug,
						}}
					/>
				))}
			</div>
		</section>
	);
}
