import { getAllUsers } from "@/lib/actions/admin";
import { Users, Mail, Calendar } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRoleSelect } from "@/components/admin/user-role-select";

export default async function UsersPage() {
	const users = await getAllUsers(100, 0);

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold">Users</h1>
				<p className="text-muted-foreground">
					Manage user accounts and permissions
				</p>
			</div>

			{users.length === 0 ? (
				<Card>
					<CardContent className="py-12">
						<div className="text-center">
							<Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">No users yet</h3>
							<p className="text-muted-foreground">
								Users will appear here once they register
							</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>All Users ({users.length})</CardTitle>
						<CardDescription>
							Manage user roles and view account information
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{users.map((user) => (
								<div
									key={user.id}
									className="flex items-center justify-between p-4 border border-border rounded-lg"
								>
									<div className="flex items-center gap-4 flex-1">
										{/* Avatar */}
										<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
											{user.avatar ? (
												<img
													src={user.avatar}
													alt={user.name || "User"}
													className="h-12 w-12 rounded-full"
												/>
											) : (
												<span className="text-lg font-semibold text-primary">
													{user.name?.[0]?.toUpperCase() || "U"}
												</span>
											)}
										</div>

										{/* User Info */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<h4 className="font-semibold truncate">
													{user.name || "Unknown"}
												</h4>
												<Badge
													variant={
														user.role === "admin"
															? "default"
															: user.role === "server_owner"
																? "secondary"
																: "outline"
													}
												>
													{user.role}
												</Badge>
											</div>
											<div className="flex items-center gap-4 text-sm text-muted-foreground">
												<span className="flex items-center gap-1">
													<Mail className="h-3 w-3" />
													{user.email}
												</span>
												<span className="flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													Joined {new Date(user.createdAt).toLocaleDateString()}
												</span>
											</div>
										</div>

										{/* Role Selector */}
										<div className="flex-shrink-0">
											<UserRoleSelect userId={user.id} currentRole={user.role} />
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
