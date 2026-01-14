import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbProps {
  serverName: string
  category: string
}

export function Breadcrumb({ serverName, category }: BreadcrumbProps) {
  return (
    <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        <li>
          <Link href="/#servers" className="text-muted-foreground hover:text-primary transition-colors">
            Servers
          </Link>
        </li>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        <li>
          <Link
            href={`/?category=${category.toLowerCase()}`}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {category}
          </Link>
        </li>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        <li>
          <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-none block">{serverName}</span>
        </li>
      </ol>
    </nav>
  )
}
