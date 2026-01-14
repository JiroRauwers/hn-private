import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap } from "lucide-react";
import * as Icons from "lucide-react";
import { getServerActivities } from "@/lib/actions/server-content";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityProps {
	serverId: string;
}

export async function RecentActivity({ serverId }: RecentActivityProps) {
	const activities = await getServerActivities(serverId);

	if (activities.length === 0) {
		return null; // Don't render if no activities
	}

	return (
		<Card className="border-border bg-card overflow-hidden">
			<CardHeader className="flex flex-row items-center justify-between border-b border-border bg-secondary/20">
				<div className="flex items-center gap-2">
					<Activity className="h-5 w-5 text-primary" />
					<CardTitle className="text-foreground">Recent Activity</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<div className="divide-y divide-border">
					{activities.map((activity, index) => {
						// Dynamic icon loading from Lucide
						const IconComponent = (Icons as any)[activity.icon] || Icons.Zap;

						return (
							<div
								key={activity.id}
								className="flex gap-4 items-start p-4 transition-colors hover:bg-secondary/20 cursor-pointer group"
							>
								<div className="relative">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
										<IconComponent className="h-5 w-5 text-primary" />
									</div>
									{index < activities.length - 1 && (
										<div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-border" />
									)}
								</div>
								<div className="flex-1 min-w-0 py-0.5">
									<p className="font-medium text-foreground group-hover:text-primary transition-colors">
										{activity.title}
									</p>
									<p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
										{activity.description}
									</p>
								</div>
								<div className="flex flex-col items-end shrink-0">
									<span className="text-xs text-muted-foreground whitespace-nowrap">
										{formatDistanceToNow(activity.createdAt, { addSuffix: true })}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
