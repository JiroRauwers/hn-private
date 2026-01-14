"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock } from "lucide-react";
import { voteForServer, canVote } from "@/lib/actions/votes";
import { useToast } from "@/hooks/use-toast";
import HCaptcha from "@hcaptcha/react-hcaptcha";

interface VoteButtonProps {
	serverId: string;
	initialVoteCount: number;
}

export function VoteButton({ serverId, initialVoteCount }: VoteButtonProps) {
	const [voteCount, setVoteCount] = useState(initialVoteCount);
	const [canVoteNow, setCanVoteNow] = useState(true);
	const [nextVoteTime, setNextVoteTime] = useState<Date | null>(null);
	const [timeRemaining, setTimeRemaining] = useState("");
	const [showCaptcha, setShowCaptcha] = useState(false);
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();
	const captchaRef = useRef<HCaptcha>(null);

	// Check if user can vote on mount
	useEffect(() => {
		async function checkVoteEligibility() {
			try {
				const result = await canVote(serverId);
				setCanVoteNow(result.canVote);
				setNextVoteTime(result.nextVoteAt);
			} catch (error) {
				console.error("Failed to check vote eligibility:", error);
			}
		}
		checkVoteEligibility();
	}, [serverId]);

	// Update countdown timer
	useEffect(() => {
		if (!nextVoteTime) return;

		const updateTimer = () => {
			const now = new Date().getTime();
			const targetTime = new Date(nextVoteTime).getTime();
			const difference = targetTime - now;

			if (difference <= 0) {
				setCanVoteNow(true);
				setNextVoteTime(null);
				setTimeRemaining("");
				return;
			}

			const hours = Math.floor(difference / (1000 * 60 * 60));
			const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

			setTimeRemaining(`${hours}h ${minutes}m`);
		};

		updateTimer();
		const interval = setInterval(updateTimer, 60000); // Update every minute

		return () => clearInterval(interval);
	}, [nextVoteTime]);

	const handleVoteClick = () => {
		if (!canVoteNow) return;
		setShowCaptcha(true);
	};

	const handleCaptchaVerify = (token: string) => {
		startTransition(async () => {
			try {
				await voteForServer({
					serverId,
					captchaToken: token,
				});

				// Optimistically update vote count
				setVoteCount((prev) => prev + 1);

				// Set cooldown
				const nextVote = new Date(Date.now() + 24 * 60 * 60 * 1000);
				setNextVoteTime(nextVote);
				setCanVoteNow(false);
				setShowCaptcha(false);

				toast({
					title: "Vote recorded!",
					description: "Thank you for voting for this server!",
				});

				// Reset captcha
				captchaRef.current?.resetCaptcha();
			} catch (error) {
				toast({
					title: "Error",
					description:
						error instanceof Error ? error.message : "Failed to record vote",
					variant: "destructive",
				});

				// Reset captcha on error
				captchaRef.current?.resetCaptcha();
				setShowCaptcha(false);
			}
		});
	};

	const handleCaptchaError = () => {
		toast({
			title: "CAPTCHA Error",
			description: "Failed to verify CAPTCHA. Please try again.",
			variant: "destructive",
		});
		setShowCaptcha(false);
	};

	const handleCaptchaExpire = () => {
		setShowCaptcha(false);
	};

	return (
		<Card className="border-border bg-card">
			<CardContent className="p-6 space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5 text-primary" />
						<span className="text-sm font-medium text-muted-foreground">
							Total Votes
						</span>
					</div>
					<span className="text-2xl font-bold text-foreground">
						{voteCount.toLocaleString()}
					</span>
				</div>

				{canVoteNow ? (
					<>
						<Button
							onClick={handleVoteClick}
							disabled={isPending || showCaptcha}
							className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
						>
							{isPending ? "Processing..." : "Vote for Server"}
						</Button>

						{showCaptcha && (
							<div className="flex justify-center py-2">
								<HCaptcha
									ref={captchaRef}
									sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
									onVerify={handleCaptchaVerify}
									onError={handleCaptchaError}
									onExpire={handleCaptchaExpire}
								/>
							</div>
						)}
					</>
				) : (
					<div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-secondary/50 border border-border">
						<Clock className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">
							Vote again in {timeRemaining}
						</span>
					</div>
				)}

				<p className="text-xs text-muted-foreground text-center">
					You can vote once every 24 hours
				</p>
			</CardContent>
		</Card>
	);
}
