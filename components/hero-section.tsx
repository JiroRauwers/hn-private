import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroSectionProps {
	stats: {
		totalServers: number;
		playersOnline: number;
		totalVotes: number;
		totalReviews: number;
	};
}

export function HeroSection({ stats }: HeroSectionProps) {
	// Format numbers with K/M suffixes
	const formatNumber = (num: number): string => {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
		return num.toString();
	};

	const statistics = [
		{
			label: "Active Servers",
			value: formatNumber(stats.totalServers),
		},
		{
			label: "Players Online",
			value: formatNumber(stats.playersOnline),
		},
		{
			label: "Total Votes",
			value: formatNumber(stats.totalVotes),
		},
		{
			label: "Total Reviews",
			value: formatNumber(stats.totalReviews),
		},
	];

	return (
		<section className="relative overflow-hidden border-b border-border">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
			<div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
				<div className="text-center">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground">
						<Sparkles className="h-4 w-4 text-primary" />
						<span>{stats.totalServers}+ servers and growing</span>
					</div>
					<h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
						Discover Your Next
						<span className="block text-primary">Hytale Adventure</span>
					</h1>
					<p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
						Find the perfect server for your playstyle. From survival to
						creative, PvP to roleplay – explore thriving communities and create
						unforgettable memories.
					</p>
					<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button
							size="lg"
							className="bg-primary text-primary-foreground hover:bg-primary/90"
							asChild
						>
							<a href="/#servers">
								Browse Servers
								<ArrowRight className="ml-2 h-4 w-4" />
							</a>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-border text-foreground hover:bg-secondary bg-transparent"
							asChild
						>
							<Link href="/dashboard/servers/new">Add Your Server</Link>
						</Button>
					</div>
				</div>

				<div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4" id="servers">
					{statistics.map((stat) => (
						<div
							key={stat.label}
							className="rounded-xl border border-border bg-card p-4 text-center"
						>
							<div className="text-2xl font-bold text-foreground sm:text-3xl">
								{stat.value}
							</div>
							<div className="mt-1 text-sm text-muted-foreground">
								{stat.label}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
