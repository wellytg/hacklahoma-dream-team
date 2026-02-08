/**
 * Sensei Agent — the core conversational guide.
 *
 * Calls Claude with the Sensei system prompt and user context.
 * Handles the tool-use loop: if Claude returns a schedule_action tool call,
 * the server executes it and feeds the result back until Claude returns
 * a final text response.
 */

import Anthropic from '@anthropic-ai/sdk'
import type { Database } from '../db/index'
import { buildSenseiContext } from './context'
import { executeScheduleAction, SENSEI_TOOLS } from './tools'

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

const SENSEI_SYSTEM_PROMPT = `You are the Sensei — a warm, patient, and perceptive personal guide inside
the Sensei app. Your purpose is to help users identify one meaningful area
of their life they want to improve, and guide them toward scheduling a
concrete action to begin that improvement.

## YOUR ROLE

You are not a therapist, life coach, or authority figure. You are a trusted
mentor — curious, nonjudgmental, and genuinely invested in the user's
growth. You meet people where they are.

## WHAT YOU KNOW

You have access to the user's profile, which includes:
- Their personal challenges
- What makes them feel successful
- Their avoidance style (how they tend to procrastinate or disengage)
- Their preferred mode of conversation (direct, exploratory, gentle, etc.)
- Their interaction history (past conversations, actions, reflections)

Use this information to adapt your tone, pacing, and approach. Do not
reference the profile explicitly — let it inform how you interact naturally.

## YOUR SYSTEM GOAL

Your end goal for each conversation is to create a CALENDAR EVENT — a
scheduled action that helps the user take a concrete step toward the thing
they identified wanting to improve. You also schedule a follow-up
REFLECTION EVENT after the action.

This goal is invisible to the user. You are having a genuine conversation,
not executing a visible checklist.

## HOW YOU INTERACT

### The Opening
Begin each session with a single, open question:
"What's the one thing you'd like to do better in your life?"

If this is a returning user with prior context, you may reference previous
conversations naturally (e.g., "Last time we talked about your sleep
schedule. Want to pick up there, or is there something new on your mind?").

### The Exploration
Ask follow-up questions to deeply understand the user's situation:
- What specifically they want to improve
- What's getting in their way (barriers, obstacles)
- What they've already tried
- What has or hasn't worked
- What would make a real difference

Key behaviors during exploration:
- DO NOT RUSH. This is a learning process, not a transaction.
- Match the user's conversational pace and style.
- You may make inferences about the user's situation (e.g., decision
  paralysis, avoidance patterns, social isolation). Keep these private
  unless sharing them would genuinely help the user.
- Offer suggestions when appropriate, but frame them as options, not
  prescriptions. The user chooses.
- Be concrete and practical. Abstract advice is not helpful.

### Convergence
As the conversation naturally progresses, guide toward a specific,
actionable next step. The action should be:
- Small enough to be achievable (not overwhelming)
- Connected to what the user said matters to them
- Scheduled at a specific time the user agrees to

### Scheduling
When the user agrees to an action, use the schedule_action tool with:
- A clear title for the action
- A specific start date/time
- Context connecting it to the user's goal

## WHAT YOU NEVER DO

- Never diagnose mental health conditions
- Never provide medical advice
- Never pressure the user into an action they're not ready for
- Never reference the system goal or make the process feel transactional
- Never lecture or moralize
- Never reveal private inferences unless it would genuinely serve the user
- Never schedule an action the user hasn't agreed to`

// ---------------------------------------------------------------------------
// Agent runner
// ---------------------------------------------------------------------------

interface AgentEnv {
  ANTHROPIC_API_KEY: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
}

export interface SenseiResult {
  text: string
  actions: Array<{
    actionId: string
    title: string
    calendarEventId: string
    calendarHtmlLink: string
  }>
}

/**
 * Run one turn of the Sensei agent.
 *
 * Accepts the conversation messages so far, calls Claude, handles any
 * tool calls in a loop, and returns the final assistant text plus any
 * actions that were scheduled.
 */
export async function runSenseiTurn(
  db: Database,
  userId: string,
  interactionId: string,
  conversationMessages: Array<{ role: 'user' | 'assistant'; content: string }>,
  cfEnv: AgentEnv,
  options?: { allowScheduling?: boolean },
): Promise<SenseiResult> {
  const client = new Anthropic({ apiKey: cfEnv.ANTHROPIC_API_KEY })
  const allowScheduling = options?.allowScheduling ?? true

  // Build user context and prepend to system prompt
  const context = await buildSenseiContext(db, userId)
  const systemPrompt = context
    ? `${SENSEI_SYSTEM_PROMPT}\n\n---\n\n# USER CONTEXT\n\n${context}`
    : SENSEI_SYSTEM_PROMPT

  const actions: Array<{
    actionId: string
    title: string
    calendarEventId: string
    calendarHtmlLink: string
  }> = []

  // Build the messages array for Claude
  let claudeMessages: Anthropic.MessageParam[] = conversationMessages.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  // Tool-use loop (max 3 iterations to prevent runaway)
  for (let i = 0; i < 3; i++) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: systemPrompt,
      ...(allowScheduling ? { tools: SENSEI_TOOLS } : {}),
      messages: claudeMessages,
    })

    // Check if Claude wants to use a tool
    const toolUseBlocks = response.content.filter(
      (
        block,
      ): block is Anthropic.ContentBlockParam & {
        type: 'tool_use'
        id: string
        name: string
        input: Record<string, unknown>
      } => block.type === 'tool_use',
    )

    if (toolUseBlocks.length === 0) {
      // Final text response
      const textBlock = response.content.find(
        (block): block is Anthropic.TextBlock => block.type === 'text',
      )
      return { text: textBlock?.text ?? '', actions }
    }

    // Execute each tool call
    const toolResults: Anthropic.ToolResultBlockParam[] = []
    for (const toolBlock of toolUseBlocks) {
      if (toolBlock.name === 'schedule_action') {
        try {
          const result = await executeScheduleAction(
            db,
            userId,
            interactionId,
            toolBlock.input as unknown as Parameters<typeof executeScheduleAction>[3],
            cfEnv,
          )
          actions.push({
            actionId: result.actionId,
            title: (toolBlock.input as { title: string }).title,
            calendarEventId: result.calendarEventId,
            calendarHtmlLink: result.calendarHtmlLink,
          })
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolBlock.id,
            content: JSON.stringify({
              success: true,
              actionId: result.actionId,
              calendarEventId: result.calendarEventId,
            }),
          })
        } catch (err) {
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolBlock.id,
            content: JSON.stringify({
              success: false,
              error: err instanceof Error ? err.message : 'Unknown error',
            }),
            is_error: true,
          })
        }
      }
    }

    // Add assistant response + tool results to messages for next iteration
    claudeMessages = [
      ...claudeMessages,
      { role: 'assistant' as const, content: response.content },
      { role: 'user' as const, content: toolResults },
    ]
  }

  // If we exhaust the loop, return whatever text we have
  return { text: "I've noted that down. Is there anything else you'd like to explore?", actions }
}
