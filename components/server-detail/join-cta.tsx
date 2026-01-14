"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy, Check, Sparkles, Users, Zap } from "lucide-react"

interface JoinCtaProps {
  serverName: string
  ip: string
  playersOnline: number
}

export function JoinCta({ serverName, ip, playersOnline }: JoinCtaProps) {
  const [copied, setCopied] = useState(false)

  const copyIP = () => {
    navigator.clipboard.writeText(ip)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 sm:p-12 mt-12">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-primary/5 blur-2xl" />

      <div className="relative flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 mb-6">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-balance">
          Ready to Join {serverName}?
        </h2>
        <p className="text-muted-foreground max-w-lg mb-8 leading-relaxed">
          Connect now and become part of our amazing community. New players receive a starter kit with exclusive items
          to help you begin your adventure!
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 rounded-full bg-chart-1/10 px-4 py-2 border border-chart-1/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-1 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-1" />
            </span>
            <Users className="h-4 w-4 text-chart-1" />
            <span className="text-sm font-medium text-chart-1">{playersOnline.toLocaleString()} playing now</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 border border-primary/20">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Instant connect</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-lg font-semibold shadow-xl shadow-primary/25"
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            Join Server
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={copyIP}
            className="w-full sm:w-auto border-border text-foreground hover:bg-secondary bg-background/50 h-14 px-8"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-5 w-5 text-chart-1" />
                IP Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-5 w-5" />
                Copy IP Address
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Server IP: <code className="font-mono text-foreground">{ip}</code>
        </p>
      </div>
    </section>
  )
}
