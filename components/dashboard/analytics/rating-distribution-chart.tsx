"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip,
	Legend,
} from "recharts";
import { Star } from "lucide-react";

interface RatingDistributionChartProps {
	data: Array<{
		rating: number;
		count: number;
	}>;
}

const COLORS = [
	"hsl(var(--destructive))", // 1 star
	"hsl(var(--warning))", // 2 stars
	"hsl(var(--muted-foreground))", // 3 stars
	"hsl(var(--primary))", // 4 stars
	"hsl(var(--success))", // 5 stars
];

export function RatingDistributionChart({
	data,
}: RatingDistributionChartProps) {
	if (data.length === 0 || data.every((d) => d.count === 0)) {
		return (
			<Card className="border-border bg-card">
				<CardHeader className="flex flex-row items-center justify-between border-b border-border bg-secondary/20">
					<div className="flex items-center gap-2">
						<Star className="h-5 w-5 text-primary" />
						<CardTitle className="text-foreground">Rating Distribution</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="p-6">
					<div className="flex items-center justify-center h-64 text-muted-foreground">
						No rating data available yet
					</div>
				</CardContent>
			</Card>
		);
	}

	// Transform data for pie chart
	const chartData = data.map((item) => ({
		name: `${item.rating} Star${item.rating !== 1 ? "s" : ""}`,
		value: item.count,
		rating: item.rating,
	}));

	return (
		<Card className="border-border bg-card">
			<CardHeader className="flex flex-row items-center justify-between border-b border-border bg-secondary/20">
				<div className="flex items-center gap-2">
					<Star className="h-5 w-5 text-primary" />
					<CardTitle className="text-foreground">Rating Distribution</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="p-6">
				<ResponsiveContainer width="100%" height={300}>
					<PieChart>
						<Pie
							data={chartData}
							cx="50%"
							cy="50%"
							labelLine={false}
							label={({ name, percent }) =>
								percent > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : ""
							}
							outerRadius={80}
							fill="hsl(var(--primary))"
							dataKey="value"
						>
							{chartData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[entry.rating - 1] || COLORS[4]}
								/>
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "hsl(var(--card))",
								border: "1px solid hsl(var(--border))",
								borderRadius: "8px",
							}}
							labelStyle={{ color: "hsl(var(--foreground))" }}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
