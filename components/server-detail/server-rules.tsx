import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, CheckCircle2 } from "lucide-react";
import { getServerRules } from "@/lib/actions/server-content";

interface ServerRulesProps {
	serverId: string;
}

export async function ServerRules({ serverId }: ServerRulesProps) {
	const rules = await getServerRules(serverId);

	if (rules.length === 0) {
		return null; // Don't render if no rules
	}

	return (
		<Card className="border-border bg-card overflow-hidden">
			<CardHeader className="flex flex-row items-center gap-2 border-b border-border bg-secondary/20">
				<ScrollText className="h-5 w-5 text-primary" />
				<CardTitle className="text-foreground">Server Rules</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
				<ul className="space-y-3">
					{rules.map((rule, index) => (
						<li key={rule.id} className="flex items-start gap-3 group">
							<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5 group-hover:bg-primary/20 transition-colors">
								<CheckCircle2 className="h-4 w-4 text-primary" />
							</div>
							<span className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
								{rule.rule}
							</span>
						</li>
					))}
				</ul>
				<p className="text-xs text-muted-foreground mt-6 p-3 rounded-lg bg-secondary/30 border border-border">
					Breaking these rules may result in warnings, temporary bans, or
					permanent bans depending on severity.
				</p>
			</CardContent>
		</Card>
	);
}
