/**
 * Follow-up check processor.
 *
 * Runs on a cron schedule to find missed reflections:
 * 1. Query follow_up_checks where scheduledAt <= now AND executedAt IS NULL
 * 2. For each: check if a reflection_record exists for that actionId
 * 3. If found: mark executed, set reflectionFound = true
 * 4. If not found: compose a follow-up message via Claude, record it
 */

import { and, eq, isNull, lte } from 'drizzle-orm'
import { getDb } from '../db/index'
import { followUpChecks, reflectionRecords, scheduledActions, userProfiles } from '../db/schema'
import { composeFollowUpMessage } from './message-composer'

export async function processFollowUpChecks(env: Cloudflare.Env): Promise<void> {
  const db = getDb(env.DB)
  const now = new Date().toISOString()

  // Find all pending follow-up checks that are due
  const pendingChecks = await db
    .select({
      id: followUpChecks.id,
      userId: followUpChecks.userId,
      actionId: followUpChecks.actionId,
    })
    .from(followUpChecks)
    .where(and(lte(followUpChecks.scheduledAt, now), isNull(followUpChecks.executedAt)))

  for (const check of pendingChecks) {
    try {
      // Check if a reflection already exists for this action
      const reflection = await db
        .select({ id: reflectionRecords.id })
        .from(reflectionRecords)
        .where(eq(reflectionRecords.actionId, check.actionId))
        .get()

      if (reflection) {
        // Reflection exists — mark as found and executed
        await db
          .update(followUpChecks)
          .set({
            executedAt: now,
            reflectionFound: 1,
            strategyApplied: 'none',
          })
          .where(eq(followUpChecks.id, check.id))
        continue
      }

      // No reflection found — load context and compose follow-up
      const [profile, action] = await Promise.all([
        db
          .select({
            notificationTolerance: userProfiles.notificationTolerance,
            nudgePreference: userProfiles.nudgePreference,
            mode: userProfiles.mode,
          })
          .from(userProfiles)
          .where(eq(userProfiles.userId, check.userId))
          .get(),
        db
          .select({
            title: scheduledActions.title,
            goalArea: scheduledActions.goalArea,
            scheduledAt: scheduledActions.scheduledAt,
          })
          .from(scheduledActions)
          .where(eq(scheduledActions.id, check.actionId))
          .get(),
      ])

      // Don't mark as missed if the action hasn't happened yet
      if (action?.scheduledAt && new Date(action.scheduledAt) > new Date()) {
        continue
      }

      const tolerance = profile?.notificationTolerance ?? 'medium'
      const nudgePref = profile?.nudgePreference ?? 'passive'

      // Determine strategy based on user preferences
      const strategy = nudgePref === 'active' ? 'active_outreach' : 'passive_record'

      // Compose follow-up message via Claude
      const composed = await composeFollowUpMessage(
        {
          actionTitle: action?.title ?? 'your scheduled action',
          goalArea: action?.goalArea ?? undefined,
          notificationTolerance: tolerance,
          personaMode: profile?.mode ?? 'ADAPTIVE',
        },
        env.ANTHROPIC_API_KEY,
      )

      // Mark the action as missed since no reflection was found
      await db
        .update(scheduledActions)
        .set({ status: 'missed' })
        .where(eq(scheduledActions.id, check.actionId))

      // Record the follow-up check result
      await db
        .update(followUpChecks)
        .set({
          executedAt: now,
          reflectionFound: 0,
          strategyApplied: strategy,
          outreachTone: composed.tone,
          outreachContent: composed.message,
        })
        .where(eq(followUpChecks.id, check.id))
    } catch (err) {
      // Log but don't fail the entire cron run for one check
      console.error(`Follow-up check ${check.id} failed:`, err)
    }
  }
}
