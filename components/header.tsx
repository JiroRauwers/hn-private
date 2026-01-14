"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Bell, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession, signOut } from "@/lib/auth-client"
import { SearchForm } from "@/components/search-form"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, isPending } = useSession()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">H</span>
            </div>
            <span className="text-xl font-bold text-foreground">Hytopia</span>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="/#servers" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
              Servers
            </a>
            <Link href="/dashboard/servers/new" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
              Submit Server
            </Link>
          </nav>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <SearchForm className="w-64" placeholder="Search servers..." />
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.avatar || undefined} alt={session.user.name || ''} />
                    <AvatarFallback>{session.user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/servers">My Servers</Link>
                </DropdownMenuItem>
                {session.user.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/auth/sign-in">
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="mb-4">
            <SearchForm className="w-full" placeholder="Search servers..." />
          </div>
          <nav className="flex flex-col gap-3">
            <a
              href="/#servers"
              className="text-sm font-medium text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Servers
            </a>
            <Link
              href="/dashboard/servers/new"
              className="text-sm font-medium text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Submit Server
            </Link>
          </nav>
          {session ? (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session.user.avatar || undefined} alt={session.user.name || ''} />
                  <AvatarFallback>{session.user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button onClick={handleSignOut} variant="outline" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button asChild className="mt-4 w-full bg-primary text-primary-foreground">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      )}
    </header>
  )
}
