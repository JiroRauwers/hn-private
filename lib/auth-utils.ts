import { cache } from 'react'
import { cookies } from 'next/headers'
import { auth } from '@/lib/auth'

export const getSession = cache(async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('better-auth.session_token')?.value

  if (!sessionToken) return null

  return await auth.api.getSession({
    headers: {
      cookie: `better-auth.session_token=${sessionToken}`
    }
  })
})

export const requireAuth = async () => {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export const requireRole = async (role: 'server_owner' | 'admin') => {
  const session = await requireAuth()
  if (session.user.role !== role && session.user.role !== 'admin') {
    throw new Error('Forbidden')
  }
  return session
}
