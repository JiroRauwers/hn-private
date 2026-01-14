import { getAllSponsorships, getActiveSponsorships, getSponsorshipStats } from "@/lib/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Sparkles, TrendingUp, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { formatSponsorshipType } from "@/lib/payments/products";
import Link from "next/link";

export default async function AdminSponsorshipsPage() {
	const [allSponsorships, activeSponsorships, stats] = await Promise.all([
		getAllSponsorships(undefined, 50, 0),
		getActiveSponsorships(),
		getSponsorshipStats(),
	]);

	const ICON_MAP = {
		featured: Star,
		premium: Sparkles,
		bump: TrendingUp,
	};

	const STATUS_MAP = {
		pending: { label: "Pending", icon: Clock, color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
		succeeded: { label: "Succeeded", icon: CheckCircle, color: "bg-green-500/10 text-green-600 border-green-500/20" },
		failed: { label: "Failed", icon: XCircle, color: "bg-red-500/10 text-red-600 border-red-500/20" },
		refunded: { label: "Refunded", icon: AlertCircle, color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
	};

	return (
		<div className="min-h-screen bg-background p-8">
			<div className="mx-auto max-w-7xl space-y-8">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold text-foreground">Sponsorship Management</h1>
					<p className="text-muted-foreground">
						Monitor and manage server sponsorships
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Active Sponsorships</CardTitle>
							<CheckCircle className="h-4 w-4 text-chart-1" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.activeCount}</div>
							<p className="text-xs text-muted-foreground">Currently running</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
							<DollarSign className="h-4 w-4 text-chart-1" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								${Number(stats.totalRevenue).toLocaleString()}
							</div>
							<p className="text-xs text-muted-foreground">All-time earnings</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Featured</CardTitle>
							<Star className="h-4 w-4 text-yellow-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats.byType.find(t => t.type === 'featured')?.count || 0}
							</div>
							<p className="text-xs text-muted-foreground">Total featured sponsorships</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Premium</CardTitle>
							<Sparkles className="h-4 w-4 text-purple-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats.byType.find(t => t.type === 'premium')?.count || 0}
							</div>
							<p className="text-xs text-muted-foreground">Total premium listings</p>
						</CardContent>
					</Card>
				</div>

				{/* Active Sponsorships Section */}
				{activeSponsorships.length > 0 && (
					<div>
						<h2 className="text-2xl font-bold mb-4">Currently Active</h2>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{activeSponsorships.map((sponsorship) => {
								const Icon = ICON_MAP[sponsorship.type];
								return (
									<Card key={sponsorship.id} className="border-2 border-chart-1/20">
										<CardContent className="p-4 space-y-3">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Icon className="h-5 w-5 text-primary" />
													<span className="font-semibold">
														{formatSponsorshipType(sponsorship.type)}
													</span>
												</div>
												<Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">
													Active
												</Badge>
											</div>

											<div>
												<Link
													href={`/server/${sponsorship.server.slug}`}
													className="font-medium text-foreground hover:text-primary"
												>
													{sponsorship.server.name}
												</Link>
												<p className="text-xs text-muted-foreground">
													by {sponsorship.user.name}
												</p>
											</div>

											<div className="text-sm space-y-1">
												<div className="flex justify-between">
													<span className="text-muted-foreground">Amount:</span>
													<span className="font-medium">${sponsorship.amount}</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">Expires:</span>
													<span className="font-medium">
														{new Date(sponsorship.endsAt).toLocaleDateString()}
													</span>
												</div>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</div>
				)}

				{/* All Sponsorships Table */}
				<div>
					<h2 className="text-2xl font-bold mb-4">All Sponsorships</h2>
					<Card>
						<CardContent className="p-0">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-muted/50 border-b">
										<tr>
											<th className="px-4 py-3 text-left text-sm font-semibold">Server</th>
											<th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
											<th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
											<th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
											<th className="px-4 py-3 text-left text-sm font-semibold">Period</th>
											<th className="px-4 py-3 text-left text-sm font-semibold">Owner</th>
											<th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
										</tr>
									</thead>
									<tbody className="divide-y">
										{allSponsorships.map((sponsorship) => {
											const Icon = ICON_MAP[sponsorship.type];
											const statusInfo = STATUS_MAP[sponsorship.paymentStatus];
											const StatusIcon = statusInfo.icon;

											return (
												<tr key={sponsorship.id} className="hover:bg-muted/30">
													<td className="px-4 py-3">
														<Link
															href={`/server/${sponsorship.server.slug}`}
															className="font-medium text-foreground hover:text-primary"
														>
															{sponsorship.server.name}
														</Link>
													</td>
													<td className="px-4 py-3">
														<div className="flex items-center gap-2">
															<Icon className="h-4 w-4" />
															<span className="text-sm">
																{formatSponsorshipType(sponsorship.type)}
															</span>
														</div>
													</td>
													<td className="px-4 py-3 font-medium">
														${sponsorship.amount}
													</td>
													<td className="px-4 py-3">
														<Badge className={`${statusInfo.color} border`}>
															<StatusIcon className="h-3 w-3 mr-1" />
															{statusInfo.label}
														</Badge>
													</td>
													<td className="px-4 py-3 text-sm text-muted-foreground">
														{new Date(sponsorship.startsAt).toLocaleDateString()} -{" "}
														{new Date(sponsorship.endsAt).toLocaleDateString()}
													</td>
													<td className="px-4 py-3 text-sm text-muted-foreground">
														{sponsorship.user.name}
													</td>
													<td className="px-4 py-3">
														{sponsorship.paymentStatus === 'succeeded' && (
															<Button
																variant="outline"
																size="sm"
																className="text-xs"
																disabled
															>
																Refund (via Dashboard)
															</Button>
														)}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>

								{allSponsorships.length === 0 && (
									<div className="p-8 text-center text-muted-foreground">
										No sponsorships found
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
