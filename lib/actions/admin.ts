'use server'

import { db } from '@/db'
import { servers, user, reviews, sponsorships } from '@/db/schema'
import { requireRole } from '@/lib/auth-utils'
import { eq, sql, desc, count, and, gte, lte } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { polarClient } from '@/lib/payments'

// Approve server
export async function approveServer(serverId: string) {
  await requireRole('admin')

  const [updated] = await db.update(servers)
    .set({
      status: 'approved',
      approvedAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(servers.id, serverId))
    .returning()

  revalidatePath('/admin/servers/pending')
  revalidatePath('/admin/servers')
  revalidatePath('/')

  return { success: true, server: updated }
}

// Reject server
export async function rejectServer(serverId: string, reason?: string) {
  await requireRole('admin')

  const [updated] = await db.update(servers)
    .set({
      status: 'rejected',
      updatedAt: new Date()
    })
    .where(eq(servers.id, serverId))
    .returning()

  // TODO: Send email notification to server owner with rejection reason

  revalidatePath('/admin/servers/pending')
  revalidatePath('/admin/servers')

  return { success: true, server: updated }
}

// Suspend server
export async function suspendServer(serverId: string, reason?: string) {
  await requireRole('admin')

  const [updated] = await db.update(servers)
    .set({
      status: 'suspended',
      updatedAt: new Date()
    })
    .where(eq(servers.id, serverId))
    .returning()

  // TODO: Send email notification to server owner with suspension reason

  revalidatePath('/admin/servers')
  revalidatePath('/')

  return { success: true, server: updated }
}

// Unsuspend server (restore to approved)
export async function unsuspendServer(serverId: string) {
  await requireRole('admin')

  const [updated] = await db.update(servers)
    .set({
      status: 'approved',
      updatedAt: new Date()
    })
    .where(eq(servers.id, serverId))
    .returning()

  revalidatePath('/admin/servers')
  revalidatePath('/')

  return { success: true, server: updated }
}

// Toggle featured status
export async function toggleFeatured(serverId: string) {
  await requireRole('admin')

  const server = await db.query.servers.findFirst({
    where: eq(servers.id, serverId)
  })

  if (!server) {
    throw new Error('Server not found')
  }

  const [updated] = await db.update(servers)
    .set({
      featured: !server.featured,
      updatedAt: new Date()
    })
    .where(eq(servers.id, serverId))
    .returning()

  revalidatePath('/admin/servers')
  revalidatePath('/')

  return { success: true, server: updated, featured: updated.featured }
}

// Get pending servers
export async function getPendingServers() {
  await requireRole('admin')

  const pendingServers = await db.query.servers.findMany({
    where: eq(servers.status, 'pending'),
    orderBy: [servers.createdAt],
    with: {
      owner: {
        columns: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        }
      }
    }
  })

  return pendingServers
}

// Get all servers (admin view with all statuses)
export async function getAllServers(status?: 'pending' | 'approved' | 'rejected' | 'suspended', limit = 50, offset = 0) {
  await requireRole('admin')

  const conditions = status ? [eq(servers.status, status)] : []

  const allServers = await db.query.servers.findMany({
    where: conditions.length > 0 ? conditions[0] : undefined,
    orderBy: [desc(servers.createdAt)],
    limit,
    offset,
    with: {
      owner: {
        columns: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        }
      }
    }
  })

  return allServers
}

// Get all user
export async function getAllUsers(limit = 50, offset = 0) {
  await requireRole('admin')

  const allUsers = await db.query.user.findMany({
    orderBy: [desc(user.createdAt)],
    limit,
    offset
  })

  return allUsers
}

// Update user role
export async function updateUserRole(userId: string, role: 'player' | 'server_owner' | 'admin') {
  await requireRole('admin')

  const [updated] = await db.update(user)
    .set({
      role,
      updatedAt: new Date()
    })
    .where(eq(user.id, userId))
    .returning()

  return { success: true, user: updated }
}

// Get platform statistics
export async function getPlatformStats() {
  await requireRole('admin')

  // Count servers by status
  const serverStats = await db
    .select({
      status: servers.status,
      count: count()
    })
    .from(servers)
    .groupBy(servers.status)

  // Count user by role
  const userStats = await db
    .select({
      role: user.role,
      count: count()
    })
    .from(user)
    .groupBy(user.role)

  // Get total counts
  const [totalServers] = await db.select({ count: count() }).from(servers)
  const [totalUsers] = await db.select({ count: count() }).from(user)
  const [totalReviews] = await db.select({ count: count() }).from(reviews)

  // Get recent servers
  const recentServers = await db.query.servers.findMany({
    orderBy: [desc(servers.createdAt)],
    limit: 5
  })

  // Get recent user
  const recentUsers = await db.query.user.findMany({
    orderBy: [desc(user.createdAt)],
    limit: 5
  })

  return {
    servers: {
      total: totalServers.count,
      byStatus: serverStats,
      recent: recentServers
    },
    user: {
      total: totalUsers.count,
      byRole: userStats,
      recent: recentUsers
    },
    reviews: {
      total: totalReviews.count
    }
  }
}

// Delete review (admin moderation)
export async function adminDeleteReview(reviewId: string, reason?: string) {
  await requireRole('admin')

  const review = await db.query.reviews.findFirst({
    where: eq(reviews.id, reviewId)
  })

  if (!review) {
    throw new Error('Review not found')
  }

  const serverId = review.serverId

  // Delete review
  await db.delete(reviews).where(eq(reviews.id, reviewId))

  // Recalculate average rating
  const remainingReviews = await db.query.reviews.findMany({
    where: eq(reviews.serverId, serverId)
  })

  const totalRating = remainingReviews.reduce((sum, r) => sum + r.rating, 0)
  const avgRating = remainingReviews.length > 0 ? totalRating / remainingReviews.length : 0

  await db.update(servers)
    .set({
      averageRating: avgRating.toFixed(2),
      totalReviews: remainingReviews.length,
      updatedAt: new Date()
    })
    .where(eq(servers.id, serverId))

  // TODO: Send notification to review author about deletion

  revalidatePath('/server/[slug]', 'page')

  return { success: true }
}

// Ban user (prevent login)
export async function banUser(userId: string, reason?: string) {
  await requireRole('admin')

  // TODO: Implement banned flag in user table schema
  // For now, just delete their sessions to log them out
  // In production, add a 'banned' boolean field to user table

  return { success: true, message: 'User ban functionality requires database schema update' }
}

// Get server by ID (admin can see any status)
export async function getServerByIdAdmin(serverId: string) {
  await requireRole('admin')

  const server = await db.query.servers.findFirst({
    where: eq(servers.id, serverId),
    with: {
      owner: {
        columns: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        }
      }
    }
  })

  return server
}

// Get all sponsorships (admin view)
export async function getAllSponsorships(
  status?: 'pending' | 'succeeded' | 'failed' | 'refunded',
  limit = 50,
  offset = 0
) {
  await requireRole('admin')

  const conditions = status ? [eq(sponsorships.paymentStatus, status)] : []

  const allSponsorships = await db.query.sponsorships.findMany({
    where: conditions.length > 0 ? conditions[0] : undefined,
    orderBy: [desc(sponsorships.createdAt)],
    limit,
    offset,
    with: {
      server: {
        columns: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        }
      },
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  })

  return allSponsorships
}

// Get active sponsorships (currently running)
export async function getActiveSponsorships() {
  await requireRole('admin')

  const now = new Date()

  const active = await db.query.sponsorships.findMany({
    where: and(
      eq(sponsorships.paymentStatus, 'succeeded'),
      lte(sponsorships.startsAt, now),
      gte(sponsorships.endsAt, now)
    ),
    orderBy: [desc(sponsorships.createdAt)],
    with: {
      server: {
        columns: {
          id: true,
          name: true,
          slug: true,
        }
      },
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  })

  return active
}

// Get sponsorship statistics
export async function getSponsorshipStats() {
  await requireRole('admin')

  const now = new Date()

  // Count by status
  const statusStats = await db
    .select({
      status: sponsorships.paymentStatus,
      count: count()
    })
    .from(sponsorships)
    .groupBy(sponsorships.paymentStatus)

  // Count by type
  const typeStats = await db
    .select({
      type: sponsorships.type,
      count: count()
    })
    .from(sponsorships)
    .groupBy(sponsorships.type)

  // Count currently active
  const [activeCount] = await db
    .select({ count: count() })
    .from(sponsorships)
    .where(and(
      eq(sponsorships.paymentStatus, 'succeeded'),
      lte(sponsorships.startsAt, now),
      gte(sponsorships.endsAt, now)
    ))

  // Calculate total revenue (succeeded payments only)
  const [revenue] = await db
    .select({ total: sql<number>`COALESCE(SUM(CAST(${sponsorships.amount} AS DECIMAL)), 0)` })
    .from(sponsorships)
    .where(eq(sponsorships.paymentStatus, 'succeeded'))

  return {
    byStatus: statusStats,
    byType: typeStats,
    activeCount: activeCount.count,
    totalRevenue: revenue.total || 0
  }
}

// Refund sponsorship (admin only)
export async function refundSponsorship(sponsorshipId: string, reason?: string) {
  await requireRole('admin')

  const sponsorship = await db.query.sponsorships.findFirst({
    where: eq(sponsorships.id, sponsorshipId),
    with: {
      server: {
        columns: {
          id: true,
          name: true,
        }
      },
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  })

  if (!sponsorship) {
    throw new Error('Sponsorship not found')
  }

  if (sponsorship.paymentStatus === 'refunded') {
    throw new Error('Sponsorship already refunded')
  }

  if (sponsorship.paymentStatus !== 'succeeded') {
    throw new Error('Can only refund succeeded payments')
  }

  if (!sponsorship.stripePaymentIntentId) {
    throw new Error('No checkout ID found for this sponsorship')
  }

  try {
    // Note: Polar refunds are typically handled via dashboard
    // For API refunds, you would use Polar's order refund endpoint
    // This is a placeholder for the actual Polar API call

    // Get checkout from Polar
    const checkout = await polarClient.checkouts.get(sponsorship.stripePaymentIntentId)

    if (!checkout.order) {
      throw new Error('No order found for this checkout')
    }

    // TODO: Implement Polar refund API call when available
    // For now, mark as refunded in database and handle via Polar dashboard

    // Update database
    await db.update(sponsorships)
      .set({
        paymentStatus: 'refunded',
      })
      .where(eq(sponsorships.id, sponsorshipId))

    revalidatePath('/admin/sponsorships')

    return {
      success: true,
      message: 'Sponsorship marked as refunded. Please complete refund via Polar dashboard.',
      checkoutId: sponsorship.stripePaymentIntentId,
      orderId: checkout.order.id
    }
  } catch (error) {
    console.error('Error processing refund:', error)
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to process refund'
    )
  }
}
