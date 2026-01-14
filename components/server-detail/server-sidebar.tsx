"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, MessageCircle, Copy, ExternalLink, Server, Flag, Share2, Heart, Check, Clock } from "lucide-react"
import { VoteButton } from "./vote-button"

interface ServerSidebarProps {
  server: {
    ip: string
    website?: string
    discord?: string
    version: string
    uptime: number
    players: { online: number; max: number; peak: number }
  }
  serverId: string
  totalVotes: number
}

export function ServerSidebar({ server, serverId, totalVotes }: ServerSidebarProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const copyIP = () => {
    navigator.clipboard.writeText(server.ip)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4 lg:sticky lg:top-32">
      {/* Quick Join Card */}
      <Card className="border-border bg-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 border-b border-border p-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            Quick Join
          </h3>
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="rounded-xl bg-secondary/50 p-4 border border-border">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">Server IP</label>
            <div className="flex items-center justify-between mt-2">
              <code className="text-sm font-mono text-foreground">{server.ip}</code>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyIP}
                className="h-8 w-8 text-muted-foreground hover:text-primary"
              >
                {copied ? <Check className="h-4 w-4 text-chart-1" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold shadow-lg shadow-primary/20">
            <ExternalLink className="mr-2 h-5 w-5" />
            Launch & Join
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSaved(!saved)}
              className={`flex-1 border-border hover:text-foreground bg-transparent ${saved ? "text-primary border-primary/30" : "text-muted-foreground"}`}
            >
              <Heart className={`mr-2 h-4 w-4 ${saved ? "fill-primary" : ""}`} />
              {saved ? "Saved" : "Save"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-border text-muted-foreground hover:text-foreground bg-transparent"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vote Card */}
      <VoteButton serverId={serverId} initialVoteCount={totalVotes} />

      {/* Server Stats Card */}
      <Card className="border-border bg-card">
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold text-foreground">Server Stats</h3>

          <div className="space-y-1">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="flex items-center gap-2 text-sm font-medium text-chart-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-1 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-chart-1" />
                </span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Players Online</span>
              <span className="text-sm font-semibold text-primary">{server.players.online.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Peak Today</span>
              <span className="text-sm font-medium text-foreground">{server.players.peak.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm font-medium text-foreground">{server.version}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-muted-foreground">Uptime</span>
              <span className="text-sm font-semibold text-chart-1">{server.uptime}%</span>
            </div>
          </div>

          {/* Player activity chart placeholder */}
          <div className="rounded-lg bg-secondary/30 p-3 border border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Clock className="h-3 w-3" />
              <span>24h Player Activity</span>
            </div>
            <div className="flex items-end gap-1 h-12">
              {[40, 35, 25, 30, 45, 60, 75, 85, 90, 80, 70, 65, 55, 50, 60, 70, 80, 95, 100, 90, 75, 60, 50, 45].map(
                (height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/30 rounded-t hover:bg-primary/50 transition-colors"
                    style={{ height: `${height}%` }}
                  />
                ),
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links Card */}
      <Card className="border-border bg-card">
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground">Links</h3>

          <a
            href={server.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl p-3 bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-primary/20"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Website</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
          </a>

          <a
            href={server.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl p-3 bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-chart-2/20"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
              <MessageCircle className="h-5 w-5 text-chart-2" />
            </div>
            <span className="text-sm font-medium text-foreground">Discord Server</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
          </a>

          <button className="flex items-center gap-3 rounded-xl p-3 w-full text-left hover:bg-destructive/10 transition-colors border border-transparent hover:border-destructive/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <Flag className="h-5 w-5 text-destructive" />
            </div>
            <span className="text-sm text-muted-foreground">Report Server</span>
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
