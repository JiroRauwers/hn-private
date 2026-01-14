"use client";

import { useState, useTransition } from "react";
import { Check, X } from "lucide-react";
import { approveServer, rejectServer } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
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

export function ApproveRejectButtons({ serverId }: { serverId: string }) {
	const [showRejectDialog, setShowRejectDialog] = useState(false);
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();

	const handleApprove = () => {
		startTransition(async () => {
			try {
				await approveServer(serverId);
				toast({
					title: "Server approved",
					description: "The server has been approved and is now live.",
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
				await rejectServer(serverId);
				toast({
					title: "Server rejected",
					description: "The server has been rejected.",
				});
				setShowRejectDialog(false);
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

	return (
		<>
			<div className="flex items-center gap-3">
				<Button
					onClick={handleApprove}
					disabled={isPending}
					className="bg-green-600 hover:bg-green-700"
				>
					<Check className="h-4 w-4 mr-2" />
					{isPending ? "Approving..." : "Approve Server"}
				</Button>
				<Button
					onClick={() => setShowRejectDialog(true)}
					disabled={isPending}
					variant="destructive"
				>
					<X className="h-4 w-4 mr-2" />
					Reject Server
				</Button>
			</div>

			<AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Reject this server?</AlertDialogTitle>
						<AlertDialogDescription>
							This will reject the server submission. The owner will be able to
							see the rejected status in their dashboard.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleReject}
							disabled={isPending}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isPending ? "Rejecting..." : "Reject Server"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
