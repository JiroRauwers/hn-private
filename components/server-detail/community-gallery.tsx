"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface CommunityGalleryProps {
	gallery: string[];
}

export function CommunityGallery({ gallery }: CommunityGalleryProps) {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentImage, setCurrentImage] = useState(0);

	const openLightbox = (index: number) => {
		setCurrentImage(index);
		setLightboxOpen(true);
	};

	const nextImage = () => {
		setCurrentImage((prev) => (prev + 1) % gallery.length);
	};

	const prevImage = () => {
		setCurrentImage((prev) => (prev - 1 + gallery.length) % gallery.length);
	};

	return (
		<>
			<div>
				<h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
					<span>Server Gallery</span>
					<span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
						{gallery.length} photos
					</span>
				</h3>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					{gallery.map((imageUrl, index) => (
						<button
							key={index}
							onClick={() => openLightbox(index)}
							className="group relative aspect-video overflow-hidden rounded-xl border border-border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
						>
							<img
								src={imageUrl || "/placeholder.svg"}
								alt={`Gallery image ${index + 1}`}
								className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
						</button>
					))}
				</div>
			</div>

			{/* Lightbox Modal */}
			{lightboxOpen && (
				<div
					className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center"
					onClick={() => setLightboxOpen(false)}
				>
					<Button
						variant="ghost"
						size="icon"
						className="absolute top-4 right-4 h-12 w-12 rounded-full bg-secondary/80 hover:bg-secondary z-10"
						onClick={() => setLightboxOpen(false)}
					>
						<X className="h-6 w-6" />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-secondary/80 hover:bg-secondary z-10"
						onClick={(e) => {
							e.stopPropagation();
							prevImage();
						}}
					>
						<ChevronLeft className="h-6 w-6" />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-secondary/80 hover:bg-secondary z-10"
						onClick={(e) => {
							e.stopPropagation();
							nextImage();
						}}
					>
						<ChevronRight className="h-6 w-6" />
					</Button>

					<div
						className="max-w-5xl max-h-[80vh] mx-4"
						onClick={(e) => e.stopPropagation()}
					>
						<img
							src={gallery[currentImage] || "/placeholder.svg"}
							alt={`Gallery image ${currentImage + 1}`}
							className="w-full h-full object-contain rounded-xl"
						/>
						<p className="text-center text-muted-foreground text-sm mt-4">
							{currentImage + 1} / {gallery.length}
						</p>
					</div>
				</div>
			)}
		</>
	);
}
