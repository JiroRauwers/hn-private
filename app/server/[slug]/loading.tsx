import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8 animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="h-4 bg-secondary rounded w-64"></div>

          {/* Hero skeleton */}
          <div className="h-64 bg-secondary rounded-xl"></div>

          {/* Content skeleton */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-48 bg-secondary rounded-xl"></div>
              <div className="h-48 bg-secondary rounded-xl"></div>
              <div className="h-48 bg-secondary rounded-xl"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-96 bg-secondary rounded-xl"></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
