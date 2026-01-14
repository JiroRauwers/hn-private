import type { Metadata } from "next";
import { TableOfContents } from "@/components/legal/TableOfContents";
import {
	TermsOfService,
	termsTocItems,
} from "@/components/legal/TermsOfService";

export const metadata: Metadata = {
	title: "Terms of Service | HytaleServers",
	description:
		"Read the terms and conditions for using HytaleServers, a Hytale server listing platform.",
};

export default function TermsPage() {
	return (
		<div className="container max-w-7xl mx-auto px-4 py-12">
			<div className="flex gap-12">
				{/* Main Content */}
				<main className="flex-1 min-w-0">
					<TermsOfService />
				</main>

				{/* Sidebar - Table of Contents */}
				<aside className="hidden xl:block w-64 flex-shrink-0">
					<div className="sticky top-24">
						<TableOfContents items={termsTocItems} />
					</div>
				</aside>
			</div>
		</div>
	);
}
