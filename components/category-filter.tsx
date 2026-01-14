"use client"

import { Sword, Mountain, Users, Wand2, Castle, Gamepad2, Grid, Cloud } from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", label: "All Servers", icon: Grid },
  { id: "survival", label: "Survival", icon: Mountain },
  { id: "pvp", label: "PvP", icon: Sword },
  { id: "roleplay", label: "Roleplay", icon: Users },
  { id: "creative", label: "Creative", icon: Wand2 },
  { id: "adventure", label: "Adventure", icon: Castle },
  { id: "skyblock", label: "Skyblock", icon: Cloud },
  { id: "minigames", label: "Minigames", icon: Gamepad2 },
]

interface CategoryFilterProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {

  return (
    <section className="border-b border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
