import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Users,
	MessageCircle,
	Calendar,
	Award,
} from "lucide-react";
import { getCommunityStats } from "@/lib/actions/server-content";
import { CommunityGallery } from "./community-gallery";

interface CommunityHighlightsProps {
	serverId: string;
	gallery: string[];
}

export async function CommunityHighlights({
	serverId,
	gallery,
}: CommunityHighlightsProps) {
	const communityStats = await getCommunityStats(serverId);

	const stats = [
		{
			icon: Users,
			label: "Active Players",
			value: communityStats.activePlayersCount
				? communityStats.activePlayersCount.toLocaleString()
				: null,
			color: "text-primary",
			bgColor: "bg-primary/10",
		},
		{
			icon: MessageCircle,
			label: "Discord Members",
			value: communityStats.discordMembersCount
				? communityStats.discordMembersCount.toLocaleString()
				: null,
			color: "text-chart-2",
			bgColor: "bg-chart-2/10",
		},
		{
			icon: Calendar,
			label: "Events Hosted",
			value: communityStats.eventsHostedCount
				? communityStats.eventsHostedCount.toString()
				: null,
			color: "text-chart-3",
			bgColor: "bg-chart-3/10",
		},
		{
			icon: Award,
			label: "Awards Won",
			value: communityStats.awardsWonCount
				? communityStats.awardsWonCount.toString()
				: null,
			color: "text-chart-4",
			bgColor: "bg-chart-4/10",
		},
	].filter((stat) => stat.value !== null);

	// Don't render if no stats and no gallery
	if (stats.length === 0 && (!gallery || gallery.length === 0)) {
		return null;
	}

	return (
		<Card className="border-border bg-card">
			<CardHeader className="flex flex-row items-center gap-2">
				<Users className="h-5 w-5 text-primary" />
				<CardTitle className="text-foreground">Community Highlights</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Stats Grid */}
				{stats.length > 0 && (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
						{stats.map((stat) => (
							<div
								key={stat.label}
								className="group text-center rounded-xl bg-secondary/30 p-4 border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
							>
								<div
									className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} mb-3 group-hover:scale-110 transition-transform`}
								>
									<stat.icon className={`h-6 w-6 ${stat.color}`} />
								</div>
								<p className="text-2xl font-bold text-foreground">{stat.value}</p>
								<p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
							</div>
						))}
					</div>
				)}

				{/* Gallery */}
				{gallery && gallery.length > 0 && (
					<CommunityGallery gallery={gallery} />
				)}
			</CardContent>
		</Card>
	);
}

export function CommunityHighlightsStatic() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentImage(index)
    setLightboxOpen(true)
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % screenshots.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle className="text-foreground">Community Highlights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats Grid with improved design */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group text-center rounded-xl bg-secondary/30 p-4 border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} mb-3 group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Screenshot Gallery with lightbox */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <span>Server Gallery</span>
              <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{screenshots.length} photos</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {screenshots.map((screenshot, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="group relative aspect-video overflow-hidden rounded-xl border border-border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                >
                  <img
                    src={screenshot.src || "/placeholder.svg"}
                    alt={screenshot.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-xs text-foreground font-medium truncate">{screenshot.caption}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

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
              e.stopPropagation()
              prevImage()
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-secondary/80 hover:bg-secondary z-10"
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="max-w-5xl max-h-[80vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={screenshots[currentImage].src || "/placeholder.svg"}
              alt={screenshots[currentImage].alt}
              className="w-full h-full object-contain rounded-xl"
            />
            <p className="text-center text-foreground mt-4 text-lg">{screenshots[currentImage].caption}</p>
            <p className="text-center text-muted-foreground text-sm mt-1">
              {currentImage + 1} / {screenshots.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
