import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, LayoutDashboard, Server, Users, AlertTriangle } from "lucide-react";
import { getSession } from "@/lib/auth-utils";
import { cn } from "@/lib/utils";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();

	// Require authentication
	if (!session) {
		redirect("/auth/sign-in?redirect=/admin");
	}

	// Require admin role
	if (session.user.role !== "admin") {
		redirect("/?error=unauthorized");
	}

	const navItems = [
		{
			href: "/admin",
			label: "Overview",
			icon: LayoutDashboard,
		},
		{
			href: "/admin/servers/pending",
			label: "Pending Servers",
			icon: AlertTriangle,
		},
		{
			href: "/admin/servers",
			label: "All Servers",
			icon: Server,
		},
		{
			href: "/admin/users",
			label: "Users",
			icon: Users,
		},
	];

	return (
		<div className="min-h-screen bg-background">
			<div className="flex">
				{/* Sidebar */}
				<aside className="w-64 min-h-screen border-r border-border bg-card">
					<div className="p-6">
						<Link href="/" className="flex items-center gap-2 font-bold text-xl">
							<Shield className="h-6 w-6 text-primary" />
							<span>Admin Panel</span>
						</Link>
					</div>

					<nav className="px-4 space-y-1">
						{navItems.map((item) => {
							const Icon = item.icon;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
										"hover:bg-accent hover:text-accent-foreground",
										"text-muted-foreground",
									)}
								>
									<Icon className="h-5 w-5" />
									{item.label}
								</Link>
							);
						})}
					</nav>

					<div className="absolute bottom-0 left-0 w-64 p-4 border-t border-border bg-card">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
								<Shield className="h-5 w-5 text-primary" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium truncate">
									{session.user.name || "Admin"}
								</p>
								<p className="text-xs text-muted-foreground">Administrator</p>
							</div>
						</div>
						<Link
							href="/dashboard"
							className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							← Back to Dashboard
						</Link>
					</div>
				</aside>

				{/* Main content */}
				<main className="flex-1 p-8">{children}</main>
			</div>
		</div>
	);
}
