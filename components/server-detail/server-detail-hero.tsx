"use client";

import {
	Bookmark,
	Check,
	Copy,
	ExternalLink,
	Share2,
	Shield,
	Star,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ServerDetailHeroProps {
	server: {
		name: string;
		description: string;
		banner: string;
		image: string;
		players: { online: number; max: number; peak: number };
		category: string;
		rating: number;
		totalReviews: number;
		featured?: boolean;
		tags: string[];
		ip: string;
		uptime: number;
	};
}

export function ServerDetailHero({ server }: ServerDetailHeroProps) {
	const [copied, setCopied] = useState(false);
	const [saved, setSaved] = useState(false);
	const playerPercentage = (server.players.online / server.players.max) * 100;

	const copyIP = () => {
		navigator.clipboard.writeText(server.ip);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<section className="relative">
			{/* Banner with parallax-like effect */}
			<div className="relative h-56 sm:h-72 lg:h-96 overflow-hidden">
				<img
					src={server.banner || "/placeholder.svg"}
					alt={`${server.name} banner`}
					className="h-full w-full object-cover scale-105"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />

				<div className="absolute top-4 right-4 flex gap-2">
					<Button
						variant="outline"
						size="icon"
						onClick={() => setSaved(!saved)}
						className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-border hover:bg-background"
					>
						<Bookmark
							className={`h-4 w-4 ${saved ? "fill-primary text-primary" : "text-foreground"}`}
						/>
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-border hover:bg-background"
					>
						<Share2 className="h-4 w-4 text-foreground" />
					</Button>
				</div>
			</div>

			{/* Server Info Overlay */}
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="relative -mt-24 sm:-mt-28 flex flex-col gap-6 sm:flex-row sm:items-end">
					{/* Server Icon with glow effect */}
					<div className="relative h-32 w-32 sm:h-40 sm:w-40 shrink-0">
						<div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" />
						<div className="relative h-full w-full overflow-hidden rounded-2xl border-4 border-background bg-card shadow-2xl">
							<img
								src={server.image || "/placeholder.svg"}
								alt={server.name}
								className="h-full w-full object-cover"
							/>
							{server.featured && (
								<div className="absolute -right-1 -top-1 rounded-full bg-primary p-1.5 shadow-lg">
									<Star className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
								</div>
							)}
						</div>
					</div>

					{/* Server Details */}
					<div className="flex-1 pb-4">
						<div className="flex flex-wrap items-center gap-3 mb-3">
							<h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
								{server.name}
							</h1>
							<Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-3 py-1">
								{server.category}
							</Badge>
							<div className="flex items-center gap-1.5 rounded-full bg-chart-1/10 px-3 py-1.5 border border-chart-1/20">
								<span className="h-2 w-2 rounded-full bg-chart-1 animate-pulse" />
								<span className="text-xs font-medium text-chart-1">Online</span>
							</div>
						</div>

						<p className="text-muted-foreground max-w-2xl mb-5 text-base leading-relaxed">
							{server.description}
						</p>

						<div className="flex flex-wrap items-center gap-5 sm:gap-8">
							{/* Rating */}
							<div className="flex items-center gap-2">
								<div className="flex">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-5 w-5 ${i < Math.floor(server.rating) ? "fill-chart-3 text-chart-3" : "text-muted"}`}
										/>
									))}
								</div>
								<span className="text-lg font-bold text-foreground">
									{server.rating}
								</span>
								<span className="text-sm text-muted-foreground">
									({server.totalReviews.toLocaleString()})
								</span>
							</div>

							{/* Players with enhanced visual */}
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
									<Users className="h-5 w-5 text-primary" />
								</div>
								<div>
									<div className="flex items-center gap-2">
										<span className="text-lg font-bold text-primary">
											{server.players.online.toLocaleString()}
										</span>
										<span className="text-sm text-muted-foreground">
											/ {server.players.max.toLocaleString()}
										</span>
									</div>
									<div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary mt-1">
										<div
											className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
											style={{ width: `${playerPercentage}%` }}
										/>
									</div>
								</div>
							</div>

							{/* Uptime Badge */}
							<div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
								<Shield className="h-4 w-4 text-chart-1" />
								<span className="text-sm font-medium text-foreground">
									{server.uptime}% Uptime
								</span>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col gap-3 sm:pb-4 sm:min-w-[180px]">
						<Button
							size="lg"
							className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold shadow-lg shadow-primary/20"
						>
							<ExternalLink className="mr-2 h-5 w-5" />
							Join Server
						</Button>
						<Button
							variant="outline"
							size="lg"
							onClick={copyIP}
							className="border-border text-foreground hover:bg-secondary bg-transparent h-12"
						>
							{copied ? (
								<>
									<Check className="mr-2 h-5 w-5 text-chart-1" />
									Copied!
								</>
							) : (
								<>
									<Copy className="mr-2 h-5 w-5" />
									Copy IP
								</>
							)}
						</Button>
					</div>
				</div>

				{/* Tags with improved styling */}
				<div className="mt-8 flex flex-wrap gap-2">
					{server.tags.map((tag) => (
						<span
							key={tag}
							className="rounded-full bg-secondary/80 px-4 py-2 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all cursor-pointer border border-transparent hover:border-primary/20"
						>
							{tag}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
