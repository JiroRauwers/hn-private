"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { ThumbsUp } from "lucide-react";

interface VoteTrendChartProps {
	data: Array<{
		date: string;
		votes: number;
	}>;
}

export function VoteTrendChart({ data }: VoteTrendChartProps) {
	if (data.length === 0) {
		return (
			<Card className="border-border bg-card">
				<CardHeader className="flex flex-row items-center justify-between border-b border-border bg-secondary/20">
					<div className="flex items-center gap-2">
						<ThumbsUp className="h-5 w-5 text-primary" />
						<CardTitle className="text-foreground">Vote History</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="p-6">
					<div className="flex items-center justify-center h-64 text-muted-foreground">
						No vote data available yet
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-border bg-card">
			<CardHeader className="flex flex-row items-center justify-between border-b border-border bg-secondary/20">
				<div className="flex items-center gap-2">
					<ThumbsUp className="h-5 w-5 text-primary" />
					<CardTitle className="text-foreground">Vote History</CardTitle>
				</div>
				<p className="text-sm text-muted-foreground">Last 30 days</p>
			</CardHeader>
			<CardContent className="p-6">
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={data}>
						<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
						<XAxis
							dataKey="date"
							className="text-muted-foreground text-xs"
							tick={{ fill: "hsl(var(--muted-foreground))" }}
						/>
						<YAxis
							className="text-muted-foreground text-xs"
							tick={{ fill: "hsl(var(--muted-foreground))" }}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "hsl(var(--card))",
								border: "1px solid hsl(var(--border))",
								borderRadius: "8px",
							}}
							labelStyle={{ color: "hsl(var(--foreground))" }}
						/>
						<Bar
							dataKey="votes"
							fill="hsl(var(--primary))"
							radius={[8, 8, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
