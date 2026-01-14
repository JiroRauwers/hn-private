'use server'

import { db } from '@/db'
import { votes, servers } from '@/db/schema'
import { getSession } from '@/lib/auth-utils'
import { voteSchema } from '@/lib/types/server'
import { eq, and, gte, sql } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

// CAPTCHA verification with hCaptcha
async function verifyCaptcha(token: string): Promise<boolean> {
  if (!token) return false

  const response = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.HCAPTCHA_SECRET_KEY!,
      response: token,
    }).toString()
  })

  const data = await response.json()
  return data.success === true
}

// Get client IP address
async function getClientIP(): Promise<string> {
  const headersList = await headers()
  return headersList.get('x-forwarded-for')?.split(',')[0].trim()
    || headersList.get('x-real-ip')
    || 'unknown'
}

// Get user agent
async function getUserAgent(): Promise<string> {
  const headersList = await headers()
  return headersList.get('user-agent') || 'unknown'
}

// Vote for a server
export async function voteForServer(input: unknown) {
  const validated = voteSchema.parse(input)
  const session = await getSession()
  const ipAddress = await getClientIP()
  const userAgent = await getUserAgent()

  // Verify CAPTCHA
  const captchaValid = await verifyCaptcha(validated.captchaToken)
  if (!captchaValid) {
    throw new Error('Invalid CAPTCHA. Please try again.')
  }

  // Check server exists and is approved
  const server = await db.query.servers.findFirst({
    where: and(
      eq(servers.id, validated.serverId),
      eq(servers.status, 'approved')
    )
  })

  if (!server) {
    throw new Error('Server not found')
  }

  // Check 24h cooldown (either by user ID or IP address)
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  let existingVote
  if (session?.user.id) {
    // Check by user ID if authenticated
    existingVote = await db.query.votes.findFirst({
      where: and(
        eq(votes.serverId, validated.serverId),
        eq(votes.userId, session.user.id),
        gte(votes.createdAt, twentyFourHoursAgo)
      )
    })
  } else {
    // Check by IP address if not authenticated
    existingVote = await db.query.votes.findFirst({
      where: and(
        eq(votes.serverId, validated.serverId),
        eq(votes.ipAddress, ipAddress),
        gte(votes.createdAt, twentyFourHoursAgo)
      )
    })
  }

  if (existingVote) {
    const nextVoteTime = new Date(existingVote.createdAt.getTime() + 24 * 60 * 60 * 1000)
    const hoursRemaining = Math.ceil((nextVoteTime.getTime() - Date.now()) / (1000 * 60 * 60))
    throw new Error(`You can vote again in ${hoursRemaining} hour${hoursRemaining === 1 ? '' : 's'}`)
  }

  // Create vote
  await db.insert(votes).values({
    serverId: validated.serverId,
    userId: session?.user.id || null,
    ipAddress,
    userAgent,
  })

  // Update server total votes
  await db.update(servers)
    .set({
      totalVotes: sql`${servers.totalVotes} + 1`,
      updatedAt: new Date()
    })
    .where(eq(servers.id, validated.serverId))

  revalidatePath(`/server/[slug]`, 'page')
  revalidatePath('/')

  return { success: true, message: 'Vote recorded successfully!' }
}

// Check if user can vote for a server
export async function canVote(serverId: string) {
  const session = await getSession()
  const ipAddress = await getClientIP()

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  let existingVote
  if (session?.user.id) {
    existingVote = await db.query.votes.findFirst({
      where: and(
        eq(votes.serverId, serverId),
        eq(votes.userId, session.user.id),
        gte(votes.createdAt, twentyFourHoursAgo)
      )
    })
  } else {
    existingVote = await db.query.votes.findFirst({
      where: and(
        eq(votes.serverId, serverId),
        eq(votes.ipAddress, ipAddress),
        gte(votes.createdAt, twentyFourHoursAgo)
      )
    })
  }

  if (existingVote) {
    const nextVoteTime = new Date(existingVote.createdAt.getTime() + 24 * 60 * 60 * 1000)
    return {
      canVote: false,
      nextVoteAt: nextVoteTime,
      hoursRemaining: Math.ceil((nextVoteTime.getTime() - Date.now()) / (1000 * 60 * 60))
    }
  }

  return {
    canVote: true,
    nextVoteAt: null,
    hoursRemaining: 0
  }
}

// Get vote count for a server
export async function getVoteCount(serverId: string) {
  const server = await db.query.servers.findFirst({
    where: eq(servers.id, serverId),
    columns: {
      totalVotes: true
    }
  })

  return server?.totalVotes || 0
}

// Get recent voters (for server owners to see activity)
export async function getRecentVoters(serverId: string, limit = 10) {
  const session = await getSession()

  // Check if user owns the server
  const server = await db.query.servers.findFirst({
    where: eq(servers.id, serverId)
  })

  if (!server || (server.ownerId !== session?.user.id && session?.user.role !== 'admin')) {
    throw new Error('Forbidden')
  }

  const recentVotes = await db.query.votes.findMany({
    where: eq(votes.serverId, serverId),
    orderBy: [sql`${votes.createdAt} DESC`],
    limit,
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          avatar: true
        }
      }
    }
  })

  return recentVotes
}
