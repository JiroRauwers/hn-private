import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/auth/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Hytopia - Hytale Server Hub",
	description:
		"Discover and explore the best Hytale servers. Find new adventures, meet players, and join thriving communities.",
	generator: "v0.app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={cn(`font-sans antialiased`, inter.className)}>
				<AuthProvider>
					{children}
				</AuthProvider>
				<Analytics />
			</body>
		</html>
	);
}
