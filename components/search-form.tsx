"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
	className?: string;
	placeholder?: string;
}

export function SearchForm({
	className,
	placeholder = "Search servers...",
}: SearchFormProps) {
	const [query, setQuery] = useState("");
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim().length >= 2) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	};

	return (
		<form onSubmit={handleSubmit} className={className}>
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					type="search"
					placeholder={placeholder}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="pl-9"
				/>
			</div>
		</form>
	);
}
