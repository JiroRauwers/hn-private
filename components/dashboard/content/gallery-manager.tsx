"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, X, Image as ImageIcon } from "lucide-react";
import { updateServerGallery } from "@/lib/actions/server-content";

interface GalleryManagerProps {
	serverId: string;
	initialGallery: string[];
}

export function GalleryManager({
	serverId,
	initialGallery,
}: GalleryManagerProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [gallery, setGallery] = useState<string[]>(initialGallery || []);
	const [newImageUrl, setNewImageUrl] = useState("");

	const handleAddImage = () => {
		if (!newImageUrl.trim()) {
			toast({
				title: "Error",
				description: "Please enter a valid image URL",
				variant: "destructive",
			});
			return;
		}

		if (gallery.includes(newImageUrl)) {
			toast({
				title: "Error",
				description: "This image is already in the gallery",
				variant: "destructive",
			});
			return;
		}

		setGallery([...gallery, newImageUrl]);
		setNewImageUrl("");
	};

	const handleRemoveImage = (index: number) => {
		setGallery(gallery.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await updateServerGallery(serverId, { gallery });
			toast({
				title: "Success",
				description: "Gallery updated successfully",
			});
			router.refresh();
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to update gallery",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold text-foreground">Server Gallery</h2>
				<p className="text-muted-foreground mt-1">
					Manage images showcased in your server's gallery
				</p>
			</div>

			<form onSubmit={handleSubmit}>
				<Card>
					<CardHeader>
						<CardTitle>Gallery Images</CardTitle>
						<CardDescription>
							Add or remove images from your server gallery. Images will be
							displayed in the Community Highlights section.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Add New Image */}
						<div className="space-y-2">
							<Label htmlFor="newImage">Add New Image</Label>
							<div className="flex gap-2">
								<Input
									id="newImage"
									type="url"
									value={newImageUrl}
									onChange={(e) => setNewImageUrl(e.target.value)}
									placeholder="https://example.com/image.png"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddImage();
										}
									}}
								/>
								<Button
									type="button"
									onClick={handleAddImage}
									variant="outline"
								>
									<Plus className="h-4 w-4 mr-2" />
									Add
								</Button>
							</div>
							<p className="text-xs text-muted-foreground">
								Enter the full URL of the image you want to add
							</p>
						</div>

						{/* Gallery Preview */}
						{gallery.length === 0 ? (
							<div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
								<ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<p className="text-muted-foreground">
									No images in gallery yet. Add some images to showcase your
									server!
								</p>
							</div>
						) : (
							<div>
								<Label>Current Gallery ({gallery.length} images)</Label>
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
									{gallery.map((imageUrl, index) => (
										<div
											key={index}
											className="group relative aspect-video overflow-hidden rounded-lg border border-border"
										>
											<img
												src={imageUrl}
												alt={`Gallery image ${index + 1}`}
												className="h-full w-full object-cover"
												onError={(e) => {
													e.currentTarget.src = "/placeholder.svg";
												}}
											/>
											<div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
												<Button
													type="button"
													variant="destructive"
													size="icon"
													onClick={() => handleRemoveImage(index)}
												>
													<X className="h-4 w-4" />
												</Button>
											</div>
											<div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2 text-xs text-muted-foreground truncate">
												{imageUrl}
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						<div className="flex justify-end pt-4 border-t">
							<Button type="submit" disabled={loading}>
								<Save className="h-4 w-4 mr-2" />
								{loading ? "Saving..." : "Save Gallery"}
							</Button>
						</div>
					</CardContent>
				</Card>
			</form>
		</div>
	);
}
