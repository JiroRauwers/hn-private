"use client";

import { useTransition } from "react";
import { updateUserRole } from "@/lib/actions/admin";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface UserRoleSelectProps {
	userId: string;
	currentRole: string;
}

export function UserRoleSelect({ userId, currentRole }: UserRoleSelectProps) {
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();

	const handleRoleChange = (newRole: "player" | "server_owner" | "admin") => {
		startTransition(async () => {
			try {
				await updateUserRole(userId, newRole);
				toast({
					title: "Role updated",
					description: `User role has been changed to ${newRole}`,
				});
			} catch (error) {
				toast({
					title: "Error",
					description:
						error instanceof Error ? error.message : "Failed to update role",
					variant: "destructive",
				});
			}
		});
	};

	return (
		<Select
			defaultValue={currentRole}
			onValueChange={handleRoleChange}
			disabled={isPending}
		>
			<SelectTrigger className="w-[140px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="player">Player</SelectItem>
				<SelectItem value="server_owner">Server Owner</SelectItem>
				<SelectItem value="admin">Admin</SelectItem>
			</SelectContent>
		</Select>
	);
}
