import { Crown } from "lucide-react"
import { ServerCard } from "@/components/server-card"

interface FeaturedServersProps {
  servers: any[] // From database schema
  sponsorshipData?: Record<string, { featured: boolean; premium: boolean; bump: boolean }>
}

export function FeaturedServers({ servers, sponsorshipData = {} }: FeaturedServersProps) {
  // Map database server to ServerCard expected format
  const mappedServers = servers.map((server) => ({
    id: server.id,
    name: server.name,
    description: server.description,
    image: server.logo || "/placeholder.svg",
    players: {
      online: server.currentPlayers,
      max: server.maxPlayers
    },
    category: server.category,
    rating: parseFloat(server.averageRating),
    featured: server.featured,
    isNew: false, // Calculate based on createdAt if needed
    tags: server.tags as string[],
    slug: server.slug,
  }))

  // Handle empty state
  if (mappedServers.length === 0) {
    return null // Don't show section if no featured servers
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Featured Servers</h2>
              <p className="text-sm text-muted-foreground">Handpicked by our community</p>
            </div>
          </div>
          <a href="/servers?featured=true" className="text-sm font-medium text-primary hover:underline">
            View all →
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mappedServers.map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              sponsorship={sponsorshipData[server.id]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
