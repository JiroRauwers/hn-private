import { Sparkles, Star, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Server {
	id: string;
	name: string;
	description: string;
	image: string;
	players: { online: number; max: number };
	category: string;
	rating: number;
	featured?: boolean;
	isNew?: boolean;
	tags: string[];
	slug: string;
}

interface Sponsorship {
	featured?: boolean;
	premium?: boolean;
	bump?: boolean;
}

interface ServerCardProps {
	server: Server;
	compact?: boolean;
	sponsorship?: Sponsorship;
}

export function ServerCard({
	server,
	compact = false,
	sponsorship,
}: ServerCardProps) {
	const playerPercentage = (server.players.online / server.players.max) * 100;
	const isFeaturedSponsored = sponsorship?.featured;
	const isPremiumSponsored = sponsorship?.premium;
	const isBumped = sponsorship?.bump;

	return (
		<Link
			href={`/server/${server.slug}`}
			className={cn(
				"group relative overflow-hidden rounded-xl border transition-all",
				compact && "flex",
				// Featured sponsorship: gold border with glow
				isFeaturedSponsored &&
					"border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-card",
				// Premium sponsorship: purple border with highlight
				!isFeaturedSponsored &&
					isPremiumSponsored &&
					"border-2 border-purple-500/50 shadow-md shadow-purple-500/10 hover:shadow-purple-500/20 bg-gradient-to-br from-purple-500/5 to-card",
				// Bump: blue subtle border
				!isFeaturedSponsored &&
					!isPremiumSponsored &&
					isBumped &&
					"border-2 border-blue-500/30",
				// Default styling for non-sponsored
				!isFeaturedSponsored &&
					!isPremiumSponsored &&
					!isBumped &&
					"border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
			)}
		>
			<div className={cn("relative", compact ? "h-24 w-24 shrink-0" : "h-40")}>
				<img
					src={server.image || "/placeholder.svg"}
					alt={server.name}
					className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />

				<div className="absolute left-3 top-3 flex gap-2 flex-wrap">
					{/* Featured Sponsorship Badge */}
					{isFeaturedSponsored && (
						<Badge className="bg-yellow-500/90 text-white font-semibold shadow-md">
							<Star className="mr-1 h-3 w-3 fill-white" /> FEATURED
						</Badge>
					)}

					{/* Premium Sponsorship Badge */}
					{isPremiumSponsored && !isFeaturedSponsored && (
						<Badge className="bg-purple-500/90 text-white font-semibold shadow-md">
							<Sparkles className="mr-1 h-3 w-3" /> PREMIUM
						</Badge>
					)}

					{/* Bump Badge */}
					{isBumped && !isFeaturedSponsored && !isPremiumSponsored && (
						<Badge className="bg-blue-500/90 text-white shadow-md">
							<TrendingUp className="mr-1 h-3 w-3" /> BOOSTED
						</Badge>
					)}

					{/* Legacy featured badge (for non-sponsored featured) */}
					{server.featured && !isFeaturedSponsored && (
						<Badge className="bg-primary/90 text-primary-foreground">
							<Star className="mr-1 h-3 w-3" /> Featured
						</Badge>
					)}

					{/* New badge */}
					{server.isNew && (
						<Badge className="bg-chart-1/90 text-foreground">
							<Zap className="mr-1 h-3 w-3" /> New
						</Badge>
					)}
				</div>
			</div>

			<div
				className={cn("p-4", compact && "flex flex-1 flex-col justify-center")}
			>
				<div className="mb-2 flex items-start justify-between gap-2">
					<div>
						<h3
							className={cn(
								"font-semibold transition-colors",
								isFeaturedSponsored
									? "text-yellow-700 dark:text-yellow-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-300"
									: isPremiumSponsored
										? "text-purple-700 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300"
										: "text-foreground group-hover:text-primary",
							)}
						>
							{server.name}
						</h3>
						<span className="text-xs text-muted-foreground">
							{server.category}
						</span>
					</div>
					<div className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
						<Star className="h-3 w-3 fill-chart-3 text-chart-3" />
						<span className="text-xs font-medium text-foreground">
							{server.rating}
						</span>
					</div>
				</div>

				{!compact && (
					<p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
						{server.description}
					</p>
				)}

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Users className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm text-foreground">
							<span className="font-semibold text-primary">
								{server.players.online.toLocaleString()}
							</span>
							<span className="text-muted-foreground">
								/{server.players.max.toLocaleString()}
							</span>
						</span>
					</div>
					<div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
						<div
							className="h-full rounded-full bg-primary transition-all"
							style={{ width: `${playerPercentage}%` }}
						/>
					</div>
				</div>

				{!compact && server.tags.length > 0 && (
					<div className="mt-3 flex flex-wrap gap-1.5">
						{server.tags.slice(0, 3).map((tag) => (
							<span
								key={tag}
								className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
							>
								{tag}
							</span>
						))}
					</div>
				)}
			</div>
		</Link>
	);
}
