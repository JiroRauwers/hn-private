"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth-client";
import { OAuthButton } from "@/components/auth/oauth-button";

export default function SignUpPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			await signUp.email({
				email,
				password,
				name,
			});
			router.push("/");
			router.refresh();
		} catch (err) {
			console.log(err);
			setError("Failed to create account. Email may already be in use.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleOAuthSignUp = async (provider: "discord" | "google" | "github" | "microsoft") => {
		setIsLoading(true);
		try {
			await signIn.social({
				provider,
				callbackURL: "/",
			});
		} catch (err) {
			setError(`Failed to sign up with ${provider}`);
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">
						Create an Account
					</CardTitle>
					<CardDescription>
						Enter your information below to create your account
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="John Doe"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								disabled={isLoading}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="name@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={isLoading}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								minLength={8}
								disabled={isLoading}
							/>
							<p className="text-xs text-muted-foreground">
								Password must be at least 8 characters
							</p>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Creating account..." : "Create Account"}
						</Button>
					</form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-card px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<OAuthButton
							provider="discord"
							onClick={() => handleOAuthSignUp("discord")}
							disabled={isLoading}
						/>
						<OAuthButton
							provider="google"
							onClick={() => handleOAuthSignUp("google")}
							disabled={isLoading}
						/>
						<OAuthButton
							provider="github"
							onClick={() => handleOAuthSignUp("github")}
							disabled={isLoading}
						/>
						<OAuthButton
							provider="microsoft"
							onClick={() => handleOAuthSignUp("microsoft")}
							disabled={isLoading}
						/>
					</div>
				</CardContent>
				<CardFooter>
					<p className="text-sm text-muted-foreground text-center w-full">
						Already have an account?{" "}
						<Link href="/auth/sign-in" className="text-primary hover:underline">
							Sign in
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
