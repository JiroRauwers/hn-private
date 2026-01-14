import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, User, Calendar, Code, TrendingUp, Globe } from "lucide-react"

interface ServerOverviewProps {
  server: {
    longDescription: string
    established: string
    owner: string
    version: string
    players: { peak: number }
  }
}

const infoItems = [
  { icon: User, label: "Owner", key: "owner" },
  { icon: Calendar, label: "Established", key: "established" },
  { icon: Code, label: "Version", key: "version" },
]

export function ServerOverview({ server }: ServerOverviewProps) {
  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-2 border-b border-border bg-secondary/20">
        <Info className="h-5 w-5 text-primary" />
        <CardTitle className="text-foreground">About This Server</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed text-base">{server.longDescription}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border sm:grid-cols-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide block">Owner</span>
              <p className="text-sm font-semibold text-foreground mt-0.5">{server.owner}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10 shrink-0">
              <Calendar className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide block">Established</span>
              <p className="text-sm font-semibold text-foreground mt-0.5">{server.established}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10 shrink-0">
              <Code className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide block">Version</span>
              <p className="text-sm font-semibold text-foreground mt-0.5">{server.version}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10 shrink-0">
              <TrendingUp className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide block">Peak Players</span>
              <p className="text-sm font-semibold text-foreground mt-0.5">{server.players.peak.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Available 24/7</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              This server is hosted on dedicated hardware with 99.8% uptime guarantee
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
