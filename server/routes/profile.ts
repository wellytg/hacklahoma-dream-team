/**
 * Profile server functions for TanStack Start.
 *
 * Handles saving and retrieving user profiles from the intake flow.
 */

import { env } from 'cloudflare:workers'
import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import type { RawAnswers, ResolvedStateModel } from '../../shared/types'
import { validateSession } from '../auth/session'
import { getDb } from '../db/index'
import { userProfiles } from '../db/schema'

const SESSION_COOKIE = 'sensei_session'

// ---------------------------------------------------------------------------
// Helper: get authenticated userId or throw
// ---------------------------------------------------------------------------

async function requireUserId(): Promise<string> {
  const sessionValue = getCookie(SESSION_COOKIE)
  if (!sessionValue) throw new Response('Unauthorized', { status: 401 })

  const userId = await validateSession(sessionValue, env.SESSION_SECRET)
  if (!userId) throw new Response('Unauthorized', { status: 401 })

  return userId
}

// ---------------------------------------------------------------------------
// saveProfile
// ---------------------------------------------------------------------------

export const saveProfile = createServerFn({ method: 'POST' })
  .inputValidator((data: { answers: RawAnswers; resolvedState?: ResolvedStateModel }) => data)
  .handler(async ({ data }) => {
    try {
      const userId = await requireUserId()
      const db = getDb(env.DB)
      const { answers, resolvedState } = data

      const existing = await db
        .select({ id: userProfiles.id })
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .get()

      const profileData = {
        userId,
        intent: JSON.stringify(answers.intent),
        mode: answers.mode,
        drains: answers.drains,
        capabilities: answers.capabilities,
        avoidanceRoot: answers.avoidanceRoot,
        structurePref: answers.structurePref,
        valueAlignment: answers.valueAlignment,
        focusTime: answers.focusTime ?? null,
        workBurst: answers.workBurst ?? null,
        recovery: answers.recovery ?? null,
        learnStyle: answers.learnStyle ?? null,
        feedbackPref: answers.feedbackPref ?? null,
        reminderPref: answers.reminderPref ?? null,
        accessNeeds: answers.accessNeeds ? JSON.stringify(answers.accessNeeds) : null,
        resolvedState: resolvedState ? JSON.stringify(resolvedState) : null,
        intakeCompletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (existing) {
        await db.update(userProfiles).set(profileData).where(eq(userProfiles.id, existing.id))
      } else {
        await db.insert(userProfiles).values({
          id: crypto.randomUUID(),
          ...profileData,
        })
      }

      return { success: true }
    } catch (err) {
      if (err instanceof Response) throw err
      console.error('saveProfile error:', err)
      throw new Response('Failed to save profile', { status: 500 })
    }
  })

// ---------------------------------------------------------------------------
// getProfile
// ---------------------------------------------------------------------------

export const getProfile = createServerFn().handler(async () => {
  try {
    const userId = await requireUserId()
    const db = getDb(env.DB)

    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .get()

    if (!profile) return { profile: null }

    return {
      profile: {
        intent: profile.intent ? JSON.parse(profile.intent) : [],
        mode: profile.mode,
        drains: profile.drains,
        capabilities: profile.capabilities,
        avoidanceRoot: profile.avoidanceRoot,
        structurePref: profile.structurePref,
        valueAlignment: profile.valueAlignment,
        focusTime: profile.focusTime,
        workBurst: profile.workBurst,
        recovery: profile.recovery,
        learnStyle: profile.learnStyle,
        feedbackPref: profile.feedbackPref,
        reminderPref: profile.reminderPref,
        accessNeeds: profile.accessNeeds ? JSON.parse(profile.accessNeeds) : [],
        intakeCompletedAt: profile.intakeCompletedAt,
      },
    }
  } catch (err) {
    if (err instanceof Response) throw err
    console.error('getProfile error:', err)
    throw new Response('Failed to get profile', { status: 500 })
  }
})
