import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ServerCard } from "@/components/server-card";
import { searchServers } from "@/lib/actions/servers";

interface SearchPageProps {
	searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
	const query = (await searchParams).q || "";
	return {
		title: query ? `Search: ${query} - Hytopia` : "Search - Hytopia",
		description: `Search results for ${query}`,
	};
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const query = (await searchParams).q || "";

	if (!query || query.length < 2) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<main className="container mx-auto px-4 py-12">
					<h1 className="text-3xl font-bold mb-4">Search Servers</h1>
					<p className="text-muted-foreground">
						Enter at least 2 characters to search
					</p>
				</main>
				<Footer />
			</div>
		);
	}

	const results = await searchServers(query, 50);

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<main className="container mx-auto px-4 py-12">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">
						Search Results for "{query}"
					</h1>
					<p className="text-muted-foreground">
						Found {results.length} server{results.length !== 1 ? "s" : ""}
					</p>
				</div>

				{results.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-muted-foreground">
							No servers found. Try a different search term.
						</p>
					</div>
				) : (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{results.map((server) => {
							// Map server data to ServerCard format
							const mappedServer = {
								id: server.id,
								name: server.name,
								description: server.description,
								image: server.logo || "/placeholder.svg",
								players: {
									online: server.currentPlayers || 0,
									max: server.maxPlayers || 0,
								},
								tags: server.tags || [],
								category: server.category,
								rating: parseFloat(server.averageRating || "0"),
								slug: server.slug,
							};
							return <ServerCard key={server.id} server={mappedServer} />;
						})}
					</div>
				)}
			</main>
			<Footer />
		</div>
	);
}
