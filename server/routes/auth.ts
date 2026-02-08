/**
 * Auth server functions for TanStack Start.
 *
 * These are called from route components and the AuthContext to drive the
 * Google OAuth login flow and session lifecycle.
 */

import { env } from 'cloudflare:workers'
import { createServerFn } from '@tanstack/react-start'
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { exchangeCodeForTokens, getAuthorizationUrl, getUserInfo } from '../auth/google'
import { createSession, validateSession } from '../auth/session'
import { getDb } from '../db/index'
import { users } from '../db/schema'

const SESSION_COOKIE = 'sensei_session'

// ---------------------------------------------------------------------------
// getLoginUrl -- returns the Google OAuth authorization URL
// ---------------------------------------------------------------------------

export const getLoginUrl = createServerFn().handler(async () => {
  const url = getAuthorizationUrl({
    clientId: env.GOOGLE_CLIENT_ID,
    redirectUri: env.GOOGLE_REDIRECT_URI,
  })
  return { url }
})

// ---------------------------------------------------------------------------
// handleAuthCallback -- exchanges the OAuth code, upserts the user, creates
//                       a session, and sets the session cookie.
// ---------------------------------------------------------------------------

export const handleAuthCallback = createServerFn({ method: 'POST' })
  .inputValidator((data: { code: string }) => data)
  .handler(async ({ data }) => {
    const { code } = data

    // 1. Exchange the authorization code for tokens
    const tokens = await exchangeCodeForTokens(code, {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectUri: env.GOOGLE_REDIRECT_URI,
    })

    // 2. Fetch user profile from Google
    const profile = await getUserInfo(tokens.access_token)

    // 3. Upsert user in D1
    const db = getDb(env.DB)
    const existing = await db.select().from(users).where(eq(users.googleId, profile.sub)).get()

    let userId: string

    if (existing) {
      userId = existing.id
      await db
        .update(users)
        .set({
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token ?? existing.googleRefreshToken,
          googleTokenExpiry: Date.now() + tokens.expires_in * 1000,
          name: profile.name,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(users.id, userId))
    } else {
      userId = crypto.randomUUID()
      await db.insert(users).values({
        id: userId,
        email: profile.email,
        name: profile.name,
        googleId: profile.sub,
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token ?? null,
        googleTokenExpiry: Date.now() + tokens.expires_in * 1000,
      })
    }

    // 4. Create a signed session cookie
    const sessionValue = await createSession(userId, env.SESSION_SECRET)
    setCookie(SESSION_COOKIE, sessionValue, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return { userId }
  })

// ---------------------------------------------------------------------------
// logout -- clears the session cookie
// ---------------------------------------------------------------------------

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  deleteCookie(SESSION_COOKIE)
  return { success: true }
})

// ---------------------------------------------------------------------------
// getMe -- returns the current user or null
// ---------------------------------------------------------------------------

export const getMe = createServerFn().handler(async () => {
  const sessionValue = getCookie(SESSION_COOKIE)
  if (!sessionValue) return { user: null }

  const userId = await validateSession(sessionValue, env.SESSION_SECRET)
  if (!userId) return { user: null }

  const db = getDb(env.DB)
  const user = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
    })
    .from(users)
    .where(eq(users.id, userId))
    .get()

  return { user: user ?? null }
})
