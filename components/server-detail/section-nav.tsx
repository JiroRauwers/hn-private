"use client"

import { useState, useEffect } from "react"
import { Info, Gamepad2, Users, Activity, MessageSquare, Crown, ScrollText } from "lucide-react"

const sections = [
  { id: "overview", label: "Overview", icon: Info },
  { id: "features", label: "Features", icon: Gamepad2 },
  { id: "staff", label: "Staff", icon: Crown },
  { id: "community", label: "Community", icon: Users },
  { id: "rules", label: "Rules", icon: ScrollText },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "reviews", label: "Reviews", icon: MessageSquare },
]

export function SectionNav() {
  const [activeSection, setActiveSection] = useState("overview")
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400)

      const sectionElements = sections.map((s) => ({
        id: s.id,
        element: document.getElementById(s.id),
      }))

      for (const { id, element } of sectionElements.reverse()) {
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 120
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset
      window.scrollTo({ top: offsetPosition, behavior: "smooth" })
    }
  }

  return (
    <div
      className={`border-b border-border bg-background/95 backdrop-blur-sm transition-all duration-300 ${
        isSticky ? "sticky top-16 z-40 shadow-sm" : ""
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                  activeSection === section.id
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <section.icon
                  className={`h-4 w-4 ${activeSection === section.id ? "scale-110" : ""} transition-transform`}
                />
                {section.label}
                {activeSection === section.id && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
