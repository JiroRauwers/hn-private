"use client";

import { useState, useEffect } from "react";
import { CategoryFilter } from "@/components/category-filter";
import { FeaturedServers } from "@/components/featured-servers";
import { ServerList } from "@/components/server-list";
import {
	getFeaturedServers,
	getServers,
	getServersSponsorshipStatus,
} from "@/lib/actions/servers";

export function ServerListWrapper() {
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [servers, setServers] = useState<any[]>([]);
	const [featuredServers, setFeaturedServers] = useState<any[]>([]);
	const [sponsorshipData, setSponsorshipData] = useState<any>({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadData() {
			setIsLoading(true);
			const [featured, serverList] = await Promise.all([
				getFeaturedServers(),
				getServers({
					category: selectedCategory === "all" ? undefined : selectedCategory,
					sort: "votes",
					limit: 12,
				}),
			]);

			// Get sponsorship status for all servers
			const allServerIds = [
				...featured.map((s) => s.id),
				...serverList.map((s) => s.id),
			];
			const sponsorships = await getServersSponsorshipStatus(allServerIds);

			setFeaturedServers(featured);
			setServers(serverList);
			setSponsorshipData(sponsorships);
			setIsLoading(false);
		}
		loadData();
	}, [selectedCategory]);

	return (
		<>
			<CategoryFilter
				activeCategory={selectedCategory}
				onCategoryChange={setSelectedCategory}
			/>
			<FeaturedServers
				servers={featuredServers}
				sponsorshipData={sponsorshipData}
			/>
			{isLoading ? (
				<div className="flex justify-center items-center py-12">
					<div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
				</div>
			) : (
				<ServerList
					initialServers={servers}
					sponsorshipData={sponsorshipData}
					category={selectedCategory === "all" ? undefined : selectedCategory}
				/>
			)}
		</>
	);
}
