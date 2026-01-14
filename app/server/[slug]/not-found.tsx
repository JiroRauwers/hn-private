import Link from 'next/link'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Server Not Found
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The server you're looking for doesn't exist or has been removed.
            It may still be pending approval or has been taken offline.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Browse Servers</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/servers/new">Add Your Server</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
