import type { Metadata } from "next";
import {
	PrivacyPolicy,
	privacyTocItems,
} from "@/components/legal/PrivacyPolicy";
import { TableOfContents } from "@/components/legal/TableOfContents";

export const metadata: Metadata = {
	title: "Privacy Policy | HytaleServers",
	description:
		"Learn how HytaleServers collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
	return (
		<div className="container max-w-7xl mx-auto px-4 py-12">
			<div className="flex gap-12">
				{/* Main Content */}
				<main className="flex-1 min-w-0">
					<PrivacyPolicy />
				</main>

				{/* Sidebar - Table of Contents */}
				<aside className="hidden xl:block w-64 flex-shrink-0">
					<div className="sticky top-24">
						<TableOfContents items={privacyTocItems} />
					</div>
				</aside>
			</div>
		</div>
	);
}
