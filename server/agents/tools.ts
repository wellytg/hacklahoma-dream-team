/**
 * Claude tool definitions and server-side executors.
 *
 * These are the tools available to the Sensei and Reflection agents.
 * When Claude returns a tool_use block, the server executes the
 * corresponding function and feeds the result back.
 */

import type Anthropic from '@anthropic-ai/sdk'
import { eq } from 'drizzle-orm'
import { createCalendarEvent, getValidAccessToken } from '../calendar/google'
import type { Database } from '../db/index'
import { followUpChecks, reflectionRecords, scheduledActions } from '../db/schema'

// ---------------------------------------------------------------------------
// Tool schemas (Anthropic tool format)
// ---------------------------------------------------------------------------

export const SENSEI_TOOLS: Anthropic.Tool[] = [
  {
    name: 'schedule_action',
    description:
      "Schedule a concrete action on the user's Google Calendar. " +
      'Also creates a reflection event and a follow-up check. ' +
      'Only call this when the user has explicitly agreed to a specific action and time.',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: {
          type: 'string',
          description: 'Short title for the calendar event (e.g., "Wind down — phone away")',
        },
        description: {
          type: 'string',
          description: "Longer description connecting the action to the user's goal",
        },
        startDateTime: {
          type: 'string',
          description: 'ISO 8601 start time for the action (e.g., "2025-03-15T22:30:00Z")',
        },
        durationMinutes: {
          type: 'number',
          description: 'Duration in minutes (default 30)',
        },
        goalArea: {
          type: 'string',
          description: 'The area of life this relates to (e.g., "sleep", "fitness", "learning")',
        },
        goalContext: {
          type: 'string',
          description: 'Brief context about why this action matters to the user',
        },
        reflectionDelayHours: {
          type: 'number',
          description: 'Hours after the action ends to schedule the reflection event (default 12)',
        },
      },
      required: ['title', 'startDateTime'],
    },
  },
]

export const REFLECTION_TOOLS: Anthropic.Tool[] = [
  {
    name: 'complete_reflection',
    description:
      'Record the reflection outcome after the conversation. ' +
      'Call this once the user has shared how the action went.',
    input_schema: {
      type: 'object' as const,
      properties: {
        completed: {
          type: 'string',
          enum: ['yes', 'no', 'partial'],
          description: 'Whether the user completed the action',
        },
        userSummary: {
          type: 'string',
          description: "The user's own words about how it went",
        },
        barriers: {
          type: 'string',
          description: 'Any obstacles the user mentioned (JSON array as string)',
        },
        emotionalTone: {
          type: 'string',
          enum: ['positive', 'neutral', 'negative', 'mixed'],
          description: 'Overall emotional tone of the reflection',
        },
        wantsToRepeat: {
          type: 'string',
          enum: ['yes', 'no', 'unsure'],
          description: 'Whether the user wants to repeat this action',
        },
        agentNotes: {
          type: 'string',
          description: 'Agent observations about patterns or insights',
        },
      },
      required: ['completed'],
    },
  },
]

// ---------------------------------------------------------------------------
// Tool input types
// ---------------------------------------------------------------------------

interface ScheduleActionInput {
  title: string
  description?: string
  startDateTime: string
  durationMinutes?: number
  goalArea?: string
  goalContext?: string
  reflectionDelayHours?: number
}

interface CompleteReflectionInput {
  completed: 'yes' | 'no' | 'partial'
  userSummary?: string
  barriers?: string
  emotionalTone?: 'positive' | 'neutral' | 'negative' | 'mixed'
  wantsToRepeat?: 'yes' | 'no' | 'unsure'
  agentNotes?: string
}

// ---------------------------------------------------------------------------
// Executors
// ---------------------------------------------------------------------------

interface CalendarEnv {
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
}

/**
 * Execute the schedule_action tool:
 * 1. Create the action calendar event
 * 2. Create the reflection calendar event
 * 3. Insert scheduled_actions row
 * 4. Insert follow_up_checks row
 */
export async function executeScheduleAction(
  db: Database,
  userId: string,
  interactionId: string,
  input: ScheduleActionInput,
  cfEnv: CalendarEnv,
): Promise<{ actionId: string; calendarEventId: string; calendarHtmlLink: string }> {
  const duration = input.durationMinutes ?? 30
  const reflectionDelay = input.reflectionDelayHours ?? 12

  const startDate = new Date(input.startDateTime)
  const endDate = new Date(startDate.getTime() + duration * 60_000)
  const reflectionDate = new Date(endDate.getTime() + reflectionDelay * 3600_000)
  const followUpDate = new Date(reflectionDate.getTime() + 2 * 3600_000) // 2h after reflection

  // Get a valid access token
  const { accessToken, email } = await getValidAccessToken(db, userId, cfEnv)

  // Create action calendar event
  const calendarEvent = await createCalendarEvent(accessToken, {
    summary: input.title,
    description: input.description,
    startDateTime: startDate.toISOString(),
    endDateTime: endDate.toISOString(),
  })

  // Create reflection calendar event
  const reflectionEndDate = new Date(reflectionDate.getTime() + 15 * 60_000)
  const reflectionEvent = await createCalendarEvent(accessToken, {
    summary: `Reflect: ${input.title}`,
    description: `Time to reflect on "${input.title}". Open Sensei to check in.`,
    startDateTime: reflectionDate.toISOString(),
    endDateTime: reflectionEndDate.toISOString(),
  })

  // Insert scheduled action
  const actionId = crypto.randomUUID()
  await db.insert(scheduledActions).values({
    id: actionId,
    userId,
    interactionId,
    calendarEventId: calendarEvent.id,
    calendarHtmlLink: `${calendarEvent.htmlLink}&authuser=${encodeURIComponent(email)}`,
    reflectionEventId: reflectionEvent.id,
    title: input.title,
    description: input.description ?? null,
    scheduledAt: startDate.toISOString(),
    durationMinutes: duration,
    goalArea: input.goalArea ?? null,
    goalContext: input.goalContext ?? null,
    reflectionScheduledAt: reflectionDate.toISOString(),
    followUpScheduledAt: followUpDate.toISOString(),
    status: 'pending',
  })

  // Insert follow-up check
  await db.insert(followUpChecks).values({
    id: crypto.randomUUID(),
    userId,
    actionId,
    scheduledAt: followUpDate.toISOString(),
  })

  // Append authuser to force correct Google account when user has multiple accounts signed in
  const htmlLink = `${calendarEvent.htmlLink}&authuser=${encodeURIComponent(email)}`
  return { actionId, calendarEventId: calendarEvent.id, calendarHtmlLink: htmlLink }
}

/**
 * Execute the complete_reflection tool:
 * 1. Insert reflection_records row
 * 2. Update interaction status to completed
 */
export async function executeCompleteReflection(
  db: Database,
  userId: string,
  actionId: string,
  interactionId: string,
  input: CompleteReflectionInput,
): Promise<{ reflectionId: string }> {
  const reflectionId = crypto.randomUUID()

  await db.insert(reflectionRecords).values({
    id: reflectionId,
    userId,
    actionId,
    interactionId,
    completed: input.completed,
    userSummary: input.userSummary ?? null,
    barriers: input.barriers ?? null,
    emotionalTone: input.emotionalTone ?? null,
    wantsToRepeat: input.wantsToRepeat ?? null,
    agentNotes: input.agentNotes ?? null,
  })

  // Mark the action as completed or missed based on reflection
  const actionStatus = input.completed === 'no' ? 'missed' : 'completed'
  await db
    .update(scheduledActions)
    .set({ status: actionStatus })
    .where(eq(scheduledActions.id, actionId))

  return { reflectionId }
}
