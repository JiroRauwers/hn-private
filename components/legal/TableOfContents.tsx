"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
	id: string;
	title: string;
}

interface TableOfContentsProps {
	items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState<string>("");

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				});
			},
			{ rootMargin: "-100px 0px -80% 0px" },
		);

		items.forEach((item) => {
			const element = document.getElementById(item.id);
			if (element) observer.observe(element);
		});

		return () => observer.disconnect();
	}, [items]);

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<nav className="space-y-1">
			<p className="font-medium text-sm text-foreground mb-3">On this page</p>
			{items.map((item) => (
				<button
					key={item.id}
					onClick={() => scrollToSection(item.id)}
					className={cn(
						"block w-full text-left text-sm py-1 px-2 rounded-md transition-colors",
						"hover:bg-muted hover:text-foreground",
						activeId === item.id
							? "text-primary font-medium bg-primary/10"
							: "text-muted-foreground",
					)}
				>
					{item.title}
				</button>
			))}
		</nav>
	);
}
