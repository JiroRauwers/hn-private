"use client";

import { useState, useRef, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Star,
	ThumbsUp,
	MessageSquare,
	TrendingUp,
	Clock,
	ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createReview, markReviewHelpful } from "@/lib/actions/reviews";
import { useSession } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";

interface UserReviewsProps {
	serverId: string;
	initialReviews: any[];
}

export function UserReviews({ serverId, initialReviews }: UserReviewsProps) {
	const [showWriteReview, setShowWriteReview] = useState(false);
	const [selectedRating, setSelectedRating] = useState(0);
	const [sortBy, setSortBy] = useState("helpful");
	const [reviews, setReviews] = useState(initialReviews);
	const [isPending, startTransition] = useTransition();
	const { data: session } = useSession();
	const { toast } = useToast();
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Calculate rating breakdown from real reviews
	const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
		const count = reviews.filter((r: any) => r.rating === stars).length;
		const percentage =
			reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
		return { stars, count, percentage };
	});

	// Calculate average rating
	const averageRating =
		reviews.length > 0
			? (
					reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
					reviews.length
				).toFixed(1)
			: "0.0";

	const handleSubmit = () => {
		if (!session) {
			toast({
				title: "Authentication required",
				description: "Please sign in to leave a review",
				variant: "destructive",
			});
			return;
		}

		if (selectedRating === 0) {
			toast({
				title: "Rating required",
				description: "Please select a star rating",
				variant: "destructive",
			});
			return;
		}

		const content = textareaRef.current?.value || "";

		if (content.length < 20) {
			toast({
				title: "Review too short",
				description: "Please write at least 20 characters",
				variant: "destructive",
			});
			return;
		}

		if (content.length > 2000) {
			toast({
				title: "Review too long",
				description: "Please keep your review under 2000 characters",
				variant: "destructive",
			});
			return;
		}

		startTransition(async () => {
			try {
				const newReview = await createReview({
					serverId,
					rating: selectedRating,
					content,
				});

				toast({
					title: "Review submitted",
					description: "Thank you for your feedback!",
				});

				// Add new review to the list
				setReviews([newReview, ...reviews]);
				setShowWriteReview(false);
				setSelectedRating(0);
				if (textareaRef.current) {
					textareaRef.current.value = "";
				}
			} catch (error) {
				toast({
					title: "Error",
					description:
						error instanceof Error ? error.message : "Failed to submit review",
					variant: "destructive",
				});
			}
		});
	};

	const handleMarkHelpful = (reviewId: string) => {
		if (!session) {
			toast({
				title: "Authentication required",
				description: "Please sign in to mark reviews as helpful",
				variant: "destructive",
			});
			return;
		}

		startTransition(async () => {
			try {
				await markReviewHelpful(reviewId);

				// Update local state optimistically
				setReviews(
					reviews.map((r: any) =>
						r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r,
					),
				);

				toast({
					title: "Thank you!",
					description: "Your feedback has been recorded",
				});
			} catch (error) {
				toast({
					title: "Error",
					description:
						error instanceof Error
							? error.message
							: "Failed to mark review as helpful",
					variant: "destructive",
				});
			}
		});
	};

	const formatDate = (date: Date) => {
		const now = new Date();
		const reviewDate = new Date(date);
		const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
		if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
		return `${Math.floor(diffDays / 365)} years ago`;
	};

	return (
		<Card className="border-border bg-card overflow-hidden">
			<CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border bg-secondary/20">
				<div className="flex items-center gap-2">
					<MessageSquare className="h-5 w-5 text-primary" />
					<CardTitle className="text-foreground">Player Reviews</CardTitle>
					<Badge variant="secondary" className="ml-2">
						{reviews.length}
					</Badge>
				</div>
				{session ? (
					<Button
						className="bg-primary text-primary-foreground hover:bg-primary/90"
						onClick={() => setShowWriteReview(!showWriteReview)}
						disabled={isPending}
					>
						Write a Review
					</Button>
				) : (
					<Button
						variant="outline"
						onClick={() => {
							toast({
								title: "Sign in required",
								description: "Please sign in to write a review",
							});
						}}
					>
						Sign in to Review
					</Button>
				)}
			</CardHeader>
			<CardContent className="p-6 space-y-6">
				{/* Rating Summary */}
				{reviews.length > 0 && (
					<div className="flex flex-col sm:flex-row gap-6 p-5 rounded-xl bg-secondary/30 border border-border">
						<div className="text-center sm:text-left sm:pr-6 sm:border-r sm:border-border">
							<div className="text-5xl font-bold text-foreground">
								{averageRating}
							</div>
							<div className="flex justify-center sm:justify-start mt-2">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`h-5 w-5 ${
											i < Math.round(Number(averageRating))
												? "fill-chart-3 text-chart-3"
												: "text-muted"
										}`}
									/>
								))}
							</div>
							<p className="text-sm text-muted-foreground mt-1">
								{reviews.length} reviews
							</p>
						</div>
						<div className="flex-1 space-y-2">
							{ratingBreakdown.map((item) => (
								<div key={item.stars} className="flex items-center gap-3">
									<span className="text-sm text-muted-foreground w-3">
										{item.stars}
									</span>
									<Star className="h-4 w-4 fill-chart-3 text-chart-3" />
									<div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
										<div
											className="h-full bg-chart-3 rounded-full transition-all"
											style={{ width: `${item.percentage}%` }}
										/>
									</div>
									<span className="text-xs text-muted-foreground w-10 text-right">
										{item.count}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Write Review Form */}
				{showWriteReview && (
					<div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-4">
						<div>
							<label className="text-sm font-medium text-foreground mb-3 block">
								Your Rating *
							</label>
							<div className="flex gap-1">
								{[1, 2, 3, 4, 5].map((star) => (
									<button
										key={star}
										onClick={() => setSelectedRating(star)}
										className="focus:outline-none p-1"
										type="button"
									>
										<Star
											className={`h-8 w-8 transition-all ${
												star <= selectedRating
													? "fill-chart-3 text-chart-3 scale-110"
													: "text-muted hover:text-chart-3 hover:scale-105"
											}`}
										/>
									</button>
								))}
							</div>
						</div>
						<div>
							<label className="text-sm font-medium text-foreground mb-2 block">
								Your Review *
							</label>
							<Textarea
								ref={textareaRef}
								placeholder="Share your experience with this server... (minimum 20 characters)"
								className="bg-background border-border text-foreground placeholder:text-muted-foreground min-h-28 resize-none"
								disabled={isPending}
							/>
							<p className="text-xs text-muted-foreground mt-1">
								{textareaRef.current?.value.length || 0} / 2000 characters
							</p>
						</div>
						<div className="flex gap-2 justify-end">
							<Button
								variant="ghost"
								onClick={() => {
									setShowWriteReview(false);
									setSelectedRating(0);
									if (textareaRef.current) {
										textareaRef.current.value = "";
									}
								}}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button
								className="bg-primary text-primary-foreground hover:bg-primary/90"
								onClick={handleSubmit}
								disabled={isPending}
							>
								{isPending ? "Submitting..." : "Submit Review"}
							</Button>
						</div>
					</div>
				)}

				{reviews.length === 0 ? (
					<div className="text-center py-12">
						<MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
						<p className="text-muted-foreground mb-4">
							Be the first to review this server!
						</p>
						{session && (
							<Button
								onClick={() => setShowWriteReview(true)}
								className="bg-primary text-primary-foreground hover:bg-primary/90"
							>
								Write the First Review
							</Button>
						)}
					</div>
				) : (
					<>
						{/* Sort Options */}
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground">Sort by:</span>
							<Button
								variant={sortBy === "helpful" ? "secondary" : "ghost"}
								size="sm"
								onClick={() => setSortBy("helpful")}
								className="text-sm"
							>
								<TrendingUp className="h-4 w-4 mr-1" />
								Most Helpful
							</Button>
							<Button
								variant={sortBy === "recent" ? "secondary" : "ghost"}
								size="sm"
								onClick={() => setSortBy("recent")}
								className="text-sm"
							>
								<Clock className="h-4 w-4 mr-1" />
								Most Recent
							</Button>
						</div>

						{/* Reviews List */}
						<div className="space-y-4">
							{reviews.map((review: any) => (
								<div
									key={review.id}
									className="rounded-xl border border-border bg-secondary/20 p-5 hover:border-primary/20 transition-colors"
								>
									<div className="flex items-start justify-between mb-4">
										<div className="flex items-center gap-3">
											<div className="relative">
												<div className="h-12 w-12 rounded-full border-2 border-border bg-primary/10 flex items-center justify-center">
													<span className="text-lg font-semibold text-primary">
														{review.user?.name?.[0]?.toUpperCase() || "U"}
													</span>
												</div>
												{review.verified && (
													<div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
														<Star className="h-3 w-3 fill-primary-foreground text-primary-foreground" />
													</div>
												)}
											</div>
											<div>
												<div className="flex items-center gap-2">
													<p className="font-semibold text-foreground">
														{review.user?.name || "Anonymous"}
													</p>
													{review.verified && (
														<Badge
															variant="secondary"
															className="text-xs bg-primary/10 text-primary border-primary/20"
														>
															Verified Player
														</Badge>
													)}
												</div>
												<div className="flex items-center gap-2 mt-1">
													<div className="flex">
														{[...Array(5)].map((_, i) => (
															<Star
																key={i}
																className={`h-4 w-4 ${
																	i < review.rating
																		? "fill-chart-3 text-chart-3"
																		: "text-muted"
																}`}
															/>
														))}
													</div>
													<span className="text-xs text-muted-foreground">
														{formatDate(review.createdAt)}
													</span>
												</div>
											</div>
										</div>
									</div>

									<p className="text-muted-foreground leading-relaxed">
										{review.content}
									</p>

									<div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
										<button
											className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
											onClick={() => handleMarkHelpful(review.id)}
											disabled={isPending}
										>
											<ThumbsUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
											<span>Helpful ({review.helpful})</span>
										</button>
									</div>
								</div>
							))}
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
