import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { getServerStaff } from "@/lib/actions/server-content";

interface StaffShowcaseProps {
	serverId: string;
}

export async function StaffShowcase({ serverId }: StaffShowcaseProps) {
	const staffMembers = await getServerStaff(serverId);

	if (staffMembers.length === 0) {
		return null; // Don't render if no staff
	}

	return (
		<Card className="border-border bg-card overflow-hidden">
			<CardHeader className="flex flex-row items-center gap-2 border-b border-border bg-secondary/20">
				<Crown className="h-5 w-5 text-chart-3" />
				<CardTitle className="text-foreground">Meet the Team</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					{staffMembers.map((staff) => (
						<div
							key={staff.id}
							className="group relative flex flex-col items-center rounded-xl border border-border bg-secondary/30 p-4 transition-all hover:shadow-lg hover:scale-105 hover:border-primary/30"
						>
							<div className="relative mb-3">
								<img
									src={staff.avatar || "/placeholder.svg"}
									alt={staff.name}
									className="h-16 w-16 rounded-full border-2 border-background object-cover shadow-lg"
								/>
								{/* Status indicator */}
								<span
									className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background ${
										staff.status === "online"
											? "bg-chart-1"
											: staff.status === "away"
												? "bg-chart-3"
												: "bg-muted-foreground"
									}`}
								/>
							</div>
							<p className="font-semibold text-foreground text-sm text-center">
								{staff.name}
							</p>
							<Badge variant="secondary" className="mt-1.5 text-xs">
								{staff.role}
							</Badge>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
