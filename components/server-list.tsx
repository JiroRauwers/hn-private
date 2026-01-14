"use client"

import { useState, useTransition, useEffect } from "react"
import { TrendingUp, Clock, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServerCard } from "@/components/server-card"
import { cn } from "@/lib/utils"
import { getServers } from "@/lib/actions/servers"

const tabs = [
  { id: "trending", label: "Trending", icon: TrendingUp, sort: "votes" as const },
  { id: "new", label: "New Servers", icon: Clock, sort: "new" as const },
  { id: "popular", label: "Most Popular", icon: Flame, sort: "players" as const },
]

interface ServerListProps {
  initialServers: any[] // From database
  category?: string // Category filter from parent
  sponsorshipData?: Record<string, { featured: boolean; premium: boolean; bump: boolean }>
}

export function ServerList({ initialServers, category, sponsorshipData = {} }: ServerListProps) {
  const [activeTab, setActiveTab] = useState("trending")
  const [servers, setServers] = useState(initialServers)
  const [offset, setOffset] = useState(12)
  const [hasMore, setHasMore] = useState(initialServers.length === 12)
  const [isPending, startTransition] = useTransition()

  // Map database servers to card format
  const mapServers = (dbServers: any[]) => {
    return dbServers.map((server) => ({
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
      isNew: false, // Calculate based on createdAt if needed
      tags: server.tags as string[],
      slug: server.slug,
    }))
  }

  const handleTabChange = (tabId: string, sort: "votes" | "new" | "players") => {
    setActiveTab(tabId)
    startTransition(async () => {
      const newServers = await getServers({
        sort,
        limit: 12,
        category: category === 'all' ? undefined : category
      })
      setServers(newServers)
      setOffset(12)
      setHasMore(newServers.length === 12)
    })
  }

  const loadMore = () => {
    startTransition(async () => {
      const activeSort = tabs.find(t => t.id === activeTab)?.sort || "votes"
      const moreServers = await getServers({
        sort: activeSort,
        limit: 12,
        offset,
        category: category === 'all' ? undefined : category
      })
      setServers([...servers, ...moreServers])
      setOffset(offset + 12)
      setHasMore(moreServers.length === 12)
    })
  }

  // Reset servers when category changes
  useEffect(() => {
    setServers(initialServers)
    setOffset(12)
    setHasMore(initialServers.length === 12)
  }, [category, initialServers])

  const mappedServers = mapServers(servers)

  return (
    <section className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id, tab.sort)}
                  disabled={isPending}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                    isPending && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {mappedServers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No servers found. Be the first to add one!</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mappedServers.map((server) => (
                <ServerCard
                  key={server.id}
                  server={server}
                  sponsorship={sponsorshipData[server.id]}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={loadMore}
                  disabled={isPending}
                  className="border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  {isPending ? "Loading..." : "Load More Servers"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
