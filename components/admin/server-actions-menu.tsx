"use client";

import { useState, useTransition } from "react";
import { MoreVertical, Star, StarOff, Ban, CheckCircle, Trash2 } from "lucide-react";
import {
	toggleFeatured,
	suspendServer,
	unsuspendServer,
	approveServer,
	rejectServer,
} from "@/lib/actions/admin";
import { deleteServer } from "@/lib/actions/servers";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { servers } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Server = InferSelectModel<typeof servers>;

export function ServerActionsMenu({ server }: { server: Server }) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showSuspendDialog, setShowSuspendDialog] = useState(false);
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();

	const handleToggleFeatured = () => {
		startTransition(async () => {
			try {
				const result = await toggleFeatured(server.id);
				toast({
					title: result.featured ? "Server featured" : "Featured removed",
					description: result.featured
						? "The server is now featured on the homepage"
						: "The server is no longer featured",
				});
			} catch (error) {
				toast({
					title: "Error",
					description:
						error instanceof Error
							? error.message
							: "Failed to toggle featured status",
					variant: "destructive",
				});
			}
		});
	};

	const handleSuspend = () => {
		startTransition(async () => {
			try {
				await suspendServer(server.id);
				toast({
					title: "Server suspended",
					description: "The server has been suspended",
				});
				setShowSuspendDialog(false);
			} catch (error) {
				toast({
					title: "Error",
					description:
						error instanceof Error ? error.message : "Failed to suspend server",
					variant: "destructive",
				});
			}
		});
	};

	const handleUnsuspend = () => {
		startTransition(async () => {
			try {
				await unsuspendServer(server.id);
				toast({
					title: "Server unsuspended",
					description: "The server has been restored to approved status",
				});
			} catch (error) {
				toast({
					title: "Error",
					description:
						error instanceof Error ? error.message : "Failed to unsuspend server",
					variant: "destructive",
				});
			}
		});
	};

	const handleApprove = () => {
		startTransition(async () => {
			try {
				await approveServer(server.id);
				toast({
					title: "Server approved",
					description: "The server has been approved and is now live",
				});
			} catch (error) {
				toast({
					title: "Error",
					description:
						error instanceof Error ? error.message : "Failed to approve server",
					variant: "destructive",
				});
			}
		});
	};

	const handleReject = () => {
		startTransition(async () => {
			try {
				await rejectServer(server.id);
				toast({
					title: "Server rejected",
					description: "The server has been rejected",
				});
			} catch (error) {
				toast({
					title: "Error",
					description:
						error instanceof Error ? error.message : "Failed to reject server",
					variant: "destructive",
				});
			}
		});
	};

	const handleDelete = () => {
		startTransition(async () => {
			try {
				await deleteServer(server.id);
				toast({
					title: "Server deleted",
					description: "The server has been permanently deleted",
				});
				setShowDeleteDialog(false);
			} catch (error) {
				toast({
					title: "Error",
					description:
						error instanceof Error ? error.message : "Failed to delete server",
					variant: "destructive",
				});
			}
		});
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="sm" disabled={isPending}>
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{server.status === "approved" && (
						<DropdownMenuItem onClick={handleToggleFeatured}>
							{server.featured ? (
								<>
									<StarOff className="h-4 w-4 mr-2" />
									Remove Featured
								</>
							) : (
								<>
									<Star className="h-4 w-4 mr-2" />
									Make Featured
								</>
							)}
						</DropdownMenuItem>
					)}

					{server.status === "pending" && (
						<>
							<DropdownMenuItem onClick={handleApprove}>
								<CheckCircle className="h-4 w-4 mr-2" />
								Approve
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleReject}>
								<Ban className="h-4 w-4 mr-2" />
								Reject
							</DropdownMenuItem>
						</>
					)}

					{server.status === "approved" && (
						<DropdownMenuItem onClick={() => setShowSuspendDialog(true)}>
							<Ban className="h-4 w-4 mr-2" />
							Suspend
						</DropdownMenuItem>
					)}

					{server.status === "suspended" && (
						<DropdownMenuItem onClick={handleUnsuspend}>
							<CheckCircle className="h-4 w-4 mr-2" />
							Unsuspend
						</DropdownMenuItem>
					)}

					<DropdownMenuSeparator />

					<DropdownMenuItem
						onClick={() => setShowDeleteDialog(true)}
						className="text-destructive"
					>
						<Trash2 className="h-4 w-4 mr-2" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Suspend Confirmation Dialog */}
			<AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Suspend this server?</AlertDialogTitle>
						<AlertDialogDescription>
							This will temporarily disable the server. It will not appear on the
							platform until unsuspended. The owner will be notified.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleSuspend}
							disabled={isPending}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isPending ? "Suspending..." : "Suspend Server"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete this server?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							server and all associated data including votes, reviews, and
							statistics.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isPending}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isPending ? "Deleting..." : "Delete Server"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
