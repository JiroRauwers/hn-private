"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading",
	);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const token = searchParams.get("token");

		if (!token) {
			setStatus("error");
			setMessage("No verification token provided");
			return;
		}

		// The verification happens automatically via Better Auth
		// We just need to show the appropriate UI
		verifyEmail(token);
	}, [searchParams]);

	const verifyEmail = async (token: string) => {
		try {
			const response = await fetch(`/api/auth/verify-email?token=${token}`, {
				method: "GET",
			});

			if (response.ok) {
				setStatus("success");
				setMessage("Email verified successfully! Redirecting...");
				setTimeout(() => router.push("/dashboard"), 2000);
			} else {
				setStatus("error");
				setMessage("Invalid or expired verification link");
			}
		} catch (error) {
			setStatus("error");
			setMessage("An error occurred during verification");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-center">Email Verification</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-4">
					{status === "loading" && (
						<>
							<Loader2 className="h-12 w-12 animate-spin text-primary" />
							<p className="text-center text-muted-foreground">
								Verifying your email...
							</p>
						</>
					)}

					{status === "success" && (
						<>
							<CheckCircle className="h-12 w-12 text-green-500" />
							<p className="text-center text-foreground font-medium">
								{message}
							</p>
						</>
					)}

					{status === "error" && (
						<>
							<XCircle className="h-12 w-12 text-destructive" />
							<p className="text-center text-foreground font-medium">
								{message}
							</p>
							<Button asChild className="mt-4">
								<Link href="/auth/sign-in">Back to Sign In</Link>
							</Button>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
