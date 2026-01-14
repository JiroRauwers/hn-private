import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Sparkles, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { formatSponsorshipType } from "@/lib/payments/products";
import type { LucideIcon } from "lucide-react";

interface Sponsorship {
	id: string;
	type: "featured" | "premium" | "bump";
	amount: string;
	paymentStatus: string;
	startsAt: Date;
	endsAt: Date;
	createdAt: Date;
}

const ICON_MAP: Record<"featured" | "premium" | "bump", LucideIcon> = {
	featured: Star,
	premium: Sparkles,
	bump: TrendingUp,
};

const COLOR_MAP: Record<"featured" | "premium" | "bump", string> = {
	featured: "text-yellow-600 bg-yellow-600/10 border-yellow-600/20",
	premium: "text-purple-600 bg-purple-600/10 border-purple-600/20",
	bump: "text-blue-600 bg-blue-600/10 border-blue-600/20",
};

export function ActiveSponsorships({
	sponsorships,
}: {
	sponsorships: Sponsorship[];
}) {
	if (sponsorships.length === 0) {
		return null;
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{sponsorships.map((sponsorship) => {
				const Icon = ICON_MAP[sponsorship.type];
				const colorClass = COLOR_MAP[sponsorship.type];
				const endsAt = new Date(sponsorship.endsAt);
				const now = new Date();
				const timeRemaining = endsAt.getTime() - now.getTime();
				const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
				const daysRemaining = Math.floor(hoursRemaining / 24);

				return (
					<Card key={sponsorship.id} className={`border-2 ${colorClass}`}>
						<CardContent className="p-4 space-y-3">
							{/* Header */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Icon className="h-5 w-5" />
									<span className="font-semibold">
										{formatSponsorshipType(sponsorship.type)}
									</span>
								</div>
								<Badge variant="outline" className="border-current">
									<CheckCircle className="h-3 w-3 mr-1" />
									Active
								</Badge>
							</div>

							{/* Stats */}
							<div className="space-y-2 text-sm">
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Amount Paid:</span>
									<span className="font-medium">${sponsorship.amount}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Expires:</span>
									<span className="font-medium">
										{endsAt.toLocaleDateString()}
									</span>
								</div>
							</div>

							{/* Time Remaining */}
							<div className="pt-3 border-t">
								<div className="flex items-center gap-2 text-sm">
									<Clock className="h-4 w-4" />
									<span className="text-muted-foreground">
										{daysRemaining > 0
											? `${daysRemaining} day${daysRemaining > 1 ? "s" : ""} remaining`
											: hoursRemaining > 0
												? `${hoursRemaining} hour${hoursRemaining > 1 ? "s" : ""} remaining`
												: "Expiring soon"}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
