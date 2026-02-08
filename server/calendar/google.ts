/**
 * Google Calendar API helpers for Cloudflare Workers.
 *
 * Uses fetch-based calls to the Google Calendar v3 REST API.
 * Token refresh is handled via the existing refreshAccessToken() helper.
 */

import { eq } from 'drizzle-orm'
import { refreshAccessToken } from '../auth/google'
import type { Database } from '../db/index'
import { users } from '../db/schema'

const CALENDAR_API = 'https://www.googleapis.com/calendar/v3'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CalendarEventInput {
  summary: string
  description?: string
  startDateTime: string // ISO 8601
  endDateTime: string // ISO 8601
}

interface CalendarEnv {
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
}

// ---------------------------------------------------------------------------
// Token management
// ---------------------------------------------------------------------------

/**
 * Get a valid Google access token for the user, refreshing if expired.
 * Updates the DB with new token + expiry on refresh.
 */
export async function getValidAccessToken(
  db: Database,
  userId: string,
  cfEnv: CalendarEnv,
): Promise<{ accessToken: string; email: string }> {
  const user = await db
    .select({
      email: users.email,
      googleAccessToken: users.googleAccessToken,
      googleRefreshToken: users.googleRefreshToken,
      googleTokenExpiry: users.googleTokenExpiry,
    })
    .from(users)
    .where(eq(users.id, userId))
    .get()

  if (!user?.googleAccessToken || !user.googleRefreshToken) {
    throw new Error('User has no Google tokens — re-authentication required')
  }

  // If token still valid (with 60s buffer), return it
  const now = Date.now()
  if (user.googleTokenExpiry && user.googleTokenExpiry > now + 60_000) {
    return { accessToken: user.googleAccessToken, email: user.email }
  }

  // Refresh
  try {
    const refreshed = await refreshAccessToken(user.googleRefreshToken, {
      clientId: cfEnv.GOOGLE_CLIENT_ID,
      clientSecret: cfEnv.GOOGLE_CLIENT_SECRET,
    })

    const newExpiry = Date.now() + refreshed.expires_in * 1000

    await db
      .update(users)
      .set({
        googleAccessToken: refreshed.access_token,
        googleTokenExpiry: newExpiry,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId))

    return { accessToken: refreshed.access_token, email: user.email }
  } catch (err) {
    console.error('Token refresh failed for user', userId, err)
    throw new Error('Google token refresh failed — user may need to re-authenticate')
  }
}

// ---------------------------------------------------------------------------
// Calendar operations
// ---------------------------------------------------------------------------

/**
 * Create an event on the user's primary Google Calendar.
 * Returns the created event's ID and direct htmlLink.
 */
export async function createCalendarEvent(
  accessToken: string,
  event: CalendarEventInput,
): Promise<{ id: string; htmlLink: string }> {
  const body = {
    summary: event.summary,
    description: event.description ?? '',
    start: { dateTime: event.startDateTime, timeZone: 'UTC' },
    end: { dateTime: event.endDateTime, timeZone: 'UTC' },
  }

  const res = await fetch(`${CALENDAR_API}/calendars/primary/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Google Calendar API error (${res.status}): ${text}`)
  }

  const data = (await res.json()) as { id: string; htmlLink: string }
  return { id: data.id, htmlLink: data.htmlLink }
}
