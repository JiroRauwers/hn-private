import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ServerListWrapper } from "@/components/server-list-wrapper";
import { getPlatformStats } from "@/lib/actions/platform-stats";

export default async function Home() {
	// Fetch platform stats server-side
	const platformStats = await getPlatformStats();

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<main>
				<HeroSection stats={platformStats} />
				<ServerListWrapper />
			</main>
			<Footer />
		</div>
	);
}
