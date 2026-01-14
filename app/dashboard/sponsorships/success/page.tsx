import { redirect } from "next/navigation";
import { CheckCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SponsorshipSuccessPage({
	searchParams,
}: {
	searchParams: { checkout_id?: string };
}) {
	if (!searchParams.checkout_id) {
		redirect("/dashboard/servers");
	}

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<div className="max-w-2xl w-full">
				<Card className="border-2 border-chart-1/20 shadow-lg">
					<CardContent className="pt-12 pb-8 text-center space-y-6">
						{/* Success Icon */}
						<div className="flex justify-center">
							<div className="relative">
								<div className="p-4 rounded-full bg-chart-1/10 border-2 border-chart-1/20">
									<CheckCircle className="h-16 w-16 text-chart-1" />
								</div>
								<div className="absolute -top-2 -right-2">
									<Sparkles className="h-8 w-8 text-primary animate-pulse" />
								</div>
							</div>
						</div>

						{/* Success Message */}
						<div className="space-y-2">
							<h1 className="text-3xl font-bold text-foreground">
								Payment Successful!
							</h1>
							<p className="text-muted-foreground text-lg">
								Your sponsorship is now active
							</p>
						</div>

						{/* Info Box */}
						<div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm">
							<p className="text-foreground">
								Thank you for your purchase! Your server sponsorship has been
								activated and will start showing immediately across the
								platform.
							</p>
						</div>

						{/* What's Next */}
						<div className="pt-4 space-y-3">
							<h3 className="font-semibold text-foreground">What's Next?</h3>
							<ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
								<li className="flex items-start gap-2">
									<CheckCircle className="h-4 w-4 text-chart-1 mt-0.5 shrink-0" />
									<span>
										Your server will now appear in promoted positions
									</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-4 w-4 text-chart-1 mt-0.5 shrink-0" />
									<span>Enhanced visibility will attract more players</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle className="h-4 w-4 text-chart-1 mt-0.5 shrink-0" />
									<span>
										Track your sponsorship performance in your dashboard
									</span>
								</li>
							</ul>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
							<Button asChild size="lg">
								<Link href="/dashboard/servers">View My Servers</Link>
							</Button>
							<Button variant="outline" asChild size="lg">
								<Link href="/">Go to Homepage</Link>
							</Button>
						</div>

						{/* Checkout ID Reference */}
						<p className="text-xs text-muted-foreground pt-4">
							Checkout ID: {searchParams.checkout_id}
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
