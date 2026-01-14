"use client";

import type { LucideIcon } from "lucide-react";
import { Check, Sparkles, Star, TrendingUp } from "lucide-react";
import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createSponsorshipCheckout } from "@/lib/actions/sponsorships";

interface Package {
	type: "featured" | "premium" | "bump";
	name: string;
	description: string;
	icon: LucideIcon;
	features: string[];
	pricing: {
		duration: string;
		price: string;
		value: "daily" | "weekly" | "monthly" | "1h" | "3h";
		popular?: boolean;
	}[];
}

const PACKAGES: Package[] = [
	{
		type: "featured",
		name: "Featured Spot",
		description: "Top 3 positions on homepage",
		icon: Star,
		features: [
			"Top position on homepage",
			"Enhanced card styling with glow effect",
			"Prominent 'FEATURED' badge",
			"Maximum visibility to all visitors",
			"Priority placement in search results",
		],
		pricing: [
			{ duration: "1 Day", price: "$9.89", value: "daily" },
			{ duration: "7 Days", price: "$59.89", value: "weekly", popular: true },
			{ duration: "30 Days", price: "$198.89", value: "monthly" },
		],
	},
	{
		type: "premium",
		name: "Premium Listing",
		description: "Enhanced server card everywhere",
		icon: Sparkles,
		features: [
			"Highlighted border on server card",
			"Upload up to 5 gallery images",
			"Boosted ranking in search results",
			"Premium badge displayed",
			"Enhanced visibility in all listings",
		],
		pricing: [
			{ duration: "1 Day", price: "$4.89", value: "daily" },
			{ duration: "7 Days", price: "$29.89", value: "weekly", popular: true },
			{ duration: "30 Days", price: "$98.89", value: "monthly" },
		],
	},
	{
		type: "bump",
		name: "Bump",
		description: "Temporary top placement",
		icon: TrendingUp,
		features: [
			"Instantly move to top of category",
			"Quick visibility boost",
			"Perfect for special events",
			"Limited to 5 bumps per day per server",
		],
		pricing: [
			{ duration: "1 Hour", price: "$1.89", value: "1h", popular: true },
			{ duration: "3 Hours", price: "$4.89", value: "3h" },
		],
	},
];

export function SponsorshipPackages({ serverId }: { serverId: string }) {
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();

	const handlePurchase = (type: string, duration: string) => {
		startTransition(async () => {
			try {
				const { checkoutUrl } = await createSponsorshipCheckout({
					serverId,
					type,
					duration,
				});

				// Redirect to Polar checkout
				window.location.href = checkoutUrl;
			} catch (error) {
				toast({
					title: "Error",
					description:
						error instanceof Error ? error.message : "Failed to start checkout",
					variant: "destructive",
				});
			}
		});
	};

	return (
		<div className="grid gap-6 md:grid-cols-3">
			{PACKAGES.map((pkg) => {
				const Icon = pkg.icon;
				return (
					<Card
						key={pkg.type}
						className="border-2 hover:border-primary/50 transition-colors"
					>
						<CardHeader>
							<div className="flex items-center gap-3 mb-2">
								<div className="p-2 rounded-lg bg-primary/10">
									<Icon className="h-6 w-6 text-primary" />
								</div>
								<div>
									<CardTitle>{pkg.name}</CardTitle>
									<CardDescription className="text-sm">
										{pkg.description}
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Features */}
							<div className="space-y-2">
								{pkg.features.map((feature, i) => (
									<div key={i} className="flex items-start gap-2 text-sm">
										<Check className="h-4 w-4 text-chart-1 mt-0.5 shrink-0" />
										<span className="text-muted-foreground">{feature}</span>
									</div>
								))}
							</div>

							{/* Pricing Options */}
							<div className="space-y-2 pt-4 border-t">
								<p className="text-xs text-muted-foreground mb-2">
									Choose duration:
								</p>
								{pkg.pricing.map((option) => (
									<Button
										key={option.value}
										onClick={() => handlePurchase(pkg.type, option.value)}
										disabled={isPending}
										className="w-full justify-between"
										variant={option.popular ? "default" : "outline"}
									>
										<span className="flex items-center gap-2">
											{option.duration}
											{option.popular && (
												<Badge variant="secondary" className="text-xs">
													Popular
												</Badge>
											)}
										</span>
										<span className="font-bold">{option.price}</span>
									</Button>
								))}
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
