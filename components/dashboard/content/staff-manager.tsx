"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
	getServerStaff,
	createServerStaff,
	updateServerStaff,
	deleteServerStaff,
} from "@/lib/actions/server-content";
import type { ServerStaffMember } from "@/db/schema/server-content";

interface StaffManagerProps {
	serverId: string;
}

const STAFF_ROLES = [
	"Owner",
	"Admin",
	"Moderator",
	"Builder",
	"Developer",
	"Helper",
	"Support",
];

const STATUS_OPTIONS = [
	{ value: "online", label: "Online", color: "bg-green-500" },
	{ value: "away", label: "Away", color: "bg-yellow-500" },
	{ value: "offline", label: "Offline", color: "bg-gray-500" },
];

export function StaffManager({ serverId }: StaffManagerProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [staff, setStaff] = useState<ServerStaffMember[]>([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [editingStaff, setEditingStaff] = useState<ServerStaffMember | null>(
		null,
	);
	const [formData, setFormData] = useState({
		name: "",
		role: "Moderator",
		avatar: "",
		status: "offline",
	});

	useEffect(() => {
		loadStaff();
	}, [serverId]);

	const loadStaff = async () => {
		setLoading(true);
		const data = await getServerStaff(serverId);
		setStaff(data);
		setLoading(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (editingStaff) {
				await updateServerStaff(editingStaff.id, formData);
				toast({
					title: "Success",
					description: "Staff member updated successfully",
				});
			} else {
				await createServerStaff(serverId, formData);
				toast({
					title: "Success",
					description: "Staff member added successfully",
				});
			}

			setOpen(false);
			setEditingStaff(null);
			setFormData({
				name: "",
				role: "Moderator",
				avatar: "",
				status: "offline",
			});
			loadStaff();
			router.refresh();
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to save staff member",
				variant: "destructive",
			});
		}
	};

	const handleEdit = (staffMember: ServerStaffMember) => {
		setEditingStaff(staffMember);
		setFormData({
			name: staffMember.name,
			role: staffMember.role,
			avatar: staffMember.avatar || "",
			status: staffMember.status || "offline",
		});
		setOpen(true);
	};

	const handleDelete = async (staffId: string) => {
		if (!confirm("Are you sure you want to remove this staff member?")) {
			return;
		}

		try {
			await deleteServerStaff(staffId);
			toast({
				title: "Success",
				description: "Staff member removed successfully",
			});
			loadStaff();
			router.refresh();
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to delete staff member",
				variant: "destructive",
			});
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-foreground">Staff Team</h2>
					<p className="text-muted-foreground mt-1">
						Manage your server's staff members and their roles
					</p>
				</div>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button
							onClick={() => {
								setEditingStaff(null);
								setFormData({
									name: "",
									role: "Moderator",
									avatar: "",
									status: "offline",
								});
							}}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Staff
						</Button>
					</DialogTrigger>
					<DialogContent>
						<form onSubmit={handleSubmit}>
							<DialogHeader>
								<DialogTitle>
									{editingStaff ? "Edit Staff Member" : "Add Staff Member"}
								</DialogTitle>
								<DialogDescription>
									{editingStaff
										? "Update the staff member details below"
										: "Add a new staff member to your team"}
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4 py-4">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										placeholder="Staff member name"
										required
										maxLength={100}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="role">Role</Label>
									<Select
										value={formData.role}
										onValueChange={(value) =>
											setFormData({ ...formData, role: value })
										}
									>
										<SelectTrigger id="role">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{STAFF_ROLES.map((role) => (
												<SelectItem key={role} value={role}>
													{role}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="avatar">Avatar URL</Label>
									<Input
										id="avatar"
										type="url"
										value={formData.avatar}
										onChange={(e) =>
											setFormData({ ...formData, avatar: e.target.value })
										}
										placeholder="https://example.com/avatar.png"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="status">Status</Label>
									<Select
										value={formData.status}
										onValueChange={(value) =>
											setFormData({ ...formData, status: value })
										}
									>
										<SelectTrigger id="status">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{STATUS_OPTIONS.map((status) => (
												<SelectItem key={status.value} value={status.value}>
													{status.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setOpen(false)}
								>
									Cancel
								</Button>
								<Button type="submit">
									{editingStaff ? "Update" : "Add"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{staff.length === 0 ? (
				<Card>
					<CardContent className="p-12">
						<div className="text-center text-muted-foreground">
							No staff members added yet. Click "Add Staff" to get started.
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2">
					{staff.map((member) => {
						const statusConfig = STATUS_OPTIONS.find(
							(s) => s.value === member.status,
						);
						return (
							<Card key={member.id}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0">
									<div className="flex items-center gap-3">
										<div className="relative">
											<Avatar className="h-12 w-12">
												<AvatarImage src={member.avatar || undefined} />
												<AvatarFallback>
													{member.name.substring(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div
												className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${statusConfig?.color || "bg-gray-500"}`}
											/>
										</div>
										<div>
											<CardTitle className="text-lg">{member.name}</CardTitle>
											<CardDescription>
												<Badge variant="secondary" className="mt-1">
													{member.role}
												</Badge>
											</CardDescription>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleEdit(member)}
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDelete(member.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</CardHeader>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
