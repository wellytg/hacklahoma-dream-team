/**
 * Chat server functions for TanStack Start.
 *
 * Handles session creation, message sending (with agent invocation),
 * message retrieval, and active session lookup.
 */

import { env } from 'cloudflare:workers'
import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { and, desc, eq } from 'drizzle-orm'
import { runReflectionTurn } from '../agents/reflection'
import { runSenseiTurn } from '../agents/sensei'
import { validateSession } from '../auth/session'
import { getDb } from '../db/index'
import { interactions, messages } from '../db/schema'

const SESSION_COOKIE = 'sensei_session'

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

async function requireUserId(): Promise<string> {
  const sessionValue = getCookie(SESSION_COOKIE)
  if (!sessionValue) throw new Response('Unauthorized', { status: 401 })

  const userId = await validateSession(sessionValue, env.SESSION_SECRET)
  if (!userId) throw new Response('Unauthorized', { status: 401 })

  return userId
}

// ---------------------------------------------------------------------------
// startSession
// ---------------------------------------------------------------------------

export const startSession = createServerFn({ method: 'POST' })
  .inputValidator((data: { mode: 'sensei_session' | 'reflection'; actionId?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const userId = await requireUserId()
      const db = getDb(env.DB)

      const interactionId = crypto.randomUUID()
      await db.insert(interactions).values({
        id: interactionId,
        userId,
        type: data.mode,
        status: 'active',
      })

      return { interactionId, actionId: data.actionId }
    } catch (err) {
      if (err instanceof Response) throw err
      console.error('startSession error:', err)
      throw new Response('Failed to start session', { status: 500 })
    }
  })

// ---------------------------------------------------------------------------
// sendMessage
// ---------------------------------------------------------------------------

export const sendMessage = createServerFn({ method: 'POST' })
  .inputValidator((data: { interactionId: string; content: string; actionId?: string }) => data)
  .handler(async ({ data }) => {
    const userId = await requireUserId()
    const db = getDb(env.DB)

    // Verify the interaction belongs to this user
    const interaction = await db
      .select()
      .from(interactions)
      .where(and(eq(interactions.id, data.interactionId), eq(interactions.userId, userId)))
      .get()

    if (!interaction) {
      throw new Response('Interaction not found', { status: 404 })
    }

    // Save the user message
    await db.insert(messages).values({
      id: crypto.randomUUID(),
      interactionId: data.interactionId,
      role: 'user',
      content: data.content,
    })

    // Load all messages for this interaction
    const allMessages = await db
      .select({ role: messages.role, content: messages.content })
      .from(messages)
      .where(eq(messages.interactionId, data.interactionId))
      .orderBy(messages.createdAt)

    // Build conversation for Claude (only user/assistant messages)
    const conversationMessages = allMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    // Call the appropriate agent (with graceful fallback on API errors)
    let responseText: string
    let actions: Array<{ actionId: string; title: string }> = []

    try {
      if (interaction.type === 'reflection' && data.actionId) {
        const result = await runReflectionTurn(
          db,
          userId,
          data.interactionId,
          data.actionId,
          conversationMessages,
          { ANTHROPIC_API_KEY: env.ANTHROPIC_API_KEY },
        )
        responseText = result.text

        if (result.reflectionRecorded) {
          await db
            .update(interactions)
            .set({ status: 'completed', completedAt: new Date().toISOString() })
            .where(eq(interactions.id, data.interactionId))
        }
      } else {
        const result = await runSenseiTurn(db, userId, data.interactionId, conversationMessages, {
          ANTHROPIC_API_KEY: env.ANTHROPIC_API_KEY,
          GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
          GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
        })
        responseText = result.text
        actions = result.actions

        if (actions.length > 0) {
          await db
            .update(interactions)
            .set({
              status: 'completed',
              completedAt: new Date().toISOString(),
              summary: `Scheduled: ${actions.map((a) => a.title).join(', ')}`,
            })
            .where(eq(interactions.id, data.interactionId))
        }
      }
    } catch (err) {
      console.error('Agent error:', err)
      responseText = "I'm having trouble responding right now. Please try again in a moment."
    }

    // Save the assistant message
    const assistantMsgId = crypto.randomUUID()
    await db.insert(messages).values({
      id: assistantMsgId,
      interactionId: data.interactionId,
      role: 'assistant',
      content: responseText,
    })

    return {
      message: {
        id: assistantMsgId,
        role: 'assistant' as const,
        content: responseText,
        createdAt: new Date().toISOString(),
      },
      actions,
    }
  })

// ---------------------------------------------------------------------------
// getMessages
// ---------------------------------------------------------------------------

export const getMessages = createServerFn()
  .inputValidator((data: { interactionId: string }) => data)
  .handler(async ({ data }) => {
    const userId = await requireUserId()
    const db = getDb(env.DB)

    // Verify ownership
    const interaction = await db
      .select({ userId: interactions.userId })
      .from(interactions)
      .where(eq(interactions.id, data.interactionId))
      .get()

    if (!interaction || interaction.userId !== userId) {
      throw new Response('Not found', { status: 404 })
    }

    const msgs = await db
      .select({
        id: messages.id,
        role: messages.role,
        content: messages.content,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(eq(messages.interactionId, data.interactionId))
      .orderBy(messages.createdAt)

    return { messages: msgs }
  })

// ---------------------------------------------------------------------------
// getActiveSession
// ---------------------------------------------------------------------------

export const getActiveSession = createServerFn().handler(async () => {
  const userId = await requireUserId()
  const db = getDb(env.DB)

  const active = await db
    .select({
      id: interactions.id,
      type: interactions.type,
      createdAt: interactions.createdAt,
    })
    .from(interactions)
    .where(and(eq(interactions.userId, userId), eq(interactions.status, 'active')))
    .orderBy(desc(interactions.createdAt))
    .limit(1)
    .get()

  return { session: active ?? null }
})

// ---------------------------------------------------------------------------
// getScheduledActions — for dashboard
// ---------------------------------------------------------------------------

import { scheduledActions } from '../db/schema'

export const getScheduledActions = createServerFn().handler(async () => {
  const userId = await requireUserId()
  const db = getDb(env.DB)

  const actions = await db
    .select({
      id: scheduledActions.id,
      title: scheduledActions.title,
      description: scheduledActions.description,
      scheduledAt: scheduledActions.scheduledAt,
      durationMinutes: scheduledActions.durationMinutes,
      goalArea: scheduledActions.goalArea,
      status: scheduledActions.status,
      reflectionScheduledAt: scheduledActions.reflectionScheduledAt,
    })
    .from(scheduledActions)
    .where(eq(scheduledActions.userId, userId))
    .orderBy(desc(scheduledActions.createdAt))
    .limit(10)

  return { actions }
})
