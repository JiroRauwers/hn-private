import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Zap } from "lucide-react";
import * as Icons from "lucide-react";
import { getServerFeatures } from "@/lib/actions/server-content";

interface GameplayFeaturesProps {
	serverId: string;
}

export async function GameplayFeatures({ serverId }: GameplayFeaturesProps) {
	const features = await getServerFeatures(serverId);

	if (features.length === 0) {
		return null; // Don't render if no features
	}

	return (
		<Card className="border-border bg-card overflow-hidden">
			<CardHeader className="flex flex-row items-center gap-2 border-b border-border bg-secondary/20">
				<Gamepad2 className="h-5 w-5 text-primary" />
				<CardTitle className="text-foreground">Gameplay Features</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
				<div className="grid gap-4 sm:grid-cols-2">
					{features.map((feature) => {
						// Dynamic icon loading from Lucide
						const IconComponent =
							(Icons as any)[feature.icon] || Icons.Sparkles;

						return (
							<div
								key={feature.id}
								className={`group relative flex gap-4 rounded-xl border p-5 transition-all hover:shadow-lg ${
									feature.highlight
										? "border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10"
										: "border-border bg-secondary/30 hover:border-primary/30 hover:bg-secondary/50"
								}`}
							>
								{feature.highlight && (
									<div className="absolute -top-2 -right-2">
										<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
											<Zap className="h-3 w-3 text-primary-foreground fill-primary-foreground" />
										</div>
									</div>
								)}

								<div
									className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all ${
										feature.highlight
											? "bg-primary/20 text-primary group-hover:bg-primary/30"
											: "bg-primary/10 text-primary group-hover:bg-primary/20"
									}`}
								>
									<IconComponent className="h-6 w-6" />
								</div>
								<div>
									<h3 className="font-semibold text-foreground text-base">
										{feature.title}
									</h3>
									<p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
										{feature.description}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
