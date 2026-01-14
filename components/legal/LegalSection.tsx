import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LegalSectionProps {
	id: string;
	title: string;
	children: ReactNode;
	className?: string;
}

export function LegalSection({
	id,
	title,
	children,
	className,
}: LegalSectionProps) {
	return (
		<section id={id} className={cn("scroll-mt-24", className)}>
			<h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">
				{title}
			</h2>
			<div className="space-y-4 text-muted-foreground leading-7">
				{children}
			</div>
		</section>
	);
}

interface LegalSubsectionProps {
	title: string;
	children: ReactNode;
}

export function LegalSubsection({ title, children }: LegalSubsectionProps) {
	return (
		<div className="space-y-2">
			<h3 className="text-lg font-semibold text-foreground">{title}</h3>
			<div className="space-y-2">{children}</div>
		</div>
	);
}
