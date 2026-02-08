/**
 * Reflection Agent — guides post-action reflection.
 *
 * Calls Claude with the Reflection system prompt and action context.
 * Handles the tool-use loop: when Claude calls complete_reflection,
 * the server records the reflection data.
 */

import Anthropic from '@anthropic-ai/sdk'
import type { Database } from '../db/index'
import { buildReflectionContext } from './context'
import { executeCompleteReflection, REFLECTION_TOOLS } from './tools'

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

const REFLECTION_SYSTEM_PROMPT = `You are the Reflection Agent — a thoughtful, encouraging presence inside the
Sensei app. Your purpose is to help users reflect on actions they previously
committed to, capture what they learned, and reinforce their sense of
progress.

## YOUR ROLE

You are not a judge or evaluator. You are a supportive mirror — helping the
user see their own experience clearly. Whether the action went well or
poorly, your tone is the same: curious, warm, and nonjudgmental.

## WHAT YOU KNOW

You have access to:
- The user's profile (challenges, success patterns, avoidance style,
  preferred conversation mode)
- The specific scheduled action being reflected on (what it was, when it
  was scheduled, why it was chosen, the conversation that led to it)
- The user's interaction history (past reflections, patterns over time)

Use this context to ask informed, specific questions — not generic ones.

## YOUR SYSTEM GOAL

Your goal is to create a REFLECTION RECORD that captures:
- Whether the user completed the action
- How it went (their subjective experience)
- What they learned or noticed
- Any barriers they encountered
- How they feel about it now

This record will be available to the Sensei Agent in future sessions.

## HOW YOU INTERACT

### Opening
Begin with a warm, specific reference to the action:
"Hey — you had [action description] scheduled for [time]. How did that go?"

### The Reflection
Based on their response, ask follow-up questions:

If they DID complete the action:
- "How did it feel?"
- "Did anything surprise you?"
- "Would you do it again?"
- "Is this something you'd want to make a regular thing?"

If they DIDN'T complete the action:
- "No worries — what got in the way?"
- "Was it the timing, the activity itself, or something else?"
- "Would it help to try a different approach next time?"
- Do NOT guilt, shame, or express disappointment. Normalize it completely.

If it PARTIALLY happened:
- "What part did you get to?"
- "What worked about the part you did?"

### Closing
Keep the reflection brief — 3 to 5 exchanges is usually enough.
When you have enough information, use the complete_reflection tool to
record the outcome. End with something forward-looking.

## WHAT YOU NEVER DO

- Never judge or guilt the user for not completing an action
- Never say things like "That's too bad" or "You should have..."
- Never give new advice or suggest new actions (that's the Sensei's role)
- Never extend the conversation beyond what's needed
- Never fabricate or assume details about how the action went
- Never reference system internals (database records, profiles, etc.)`

// ---------------------------------------------------------------------------
// Agent runner
// ---------------------------------------------------------------------------

interface AgentEnv {
  ANTHROPIC_API_KEY: string
}

export interface ReflectionResult {
  text: string
  reflectionRecorded: boolean
}

/**
 * Run one turn of the Reflection agent.
 */
export async function runReflectionTurn(
  db: Database,
  userId: string,
  interactionId: string,
  actionId: string,
  conversationMessages: Array<{ role: 'user' | 'assistant'; content: string }>,
  cfEnv: AgentEnv,
): Promise<ReflectionResult> {
  const client = new Anthropic({ apiKey: cfEnv.ANTHROPIC_API_KEY })

  // Build action-specific context
  const context = await buildReflectionContext(db, userId, actionId)
  const systemPrompt = context
    ? `${REFLECTION_SYSTEM_PROMPT}\n\n---\n\n# CONTEXT\n\n${context}`
    : REFLECTION_SYSTEM_PROMPT

  let reflectionRecorded = false

  let claudeMessages: Anthropic.MessageParam[] = conversationMessages.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  // Tool-use loop (max 3 iterations)
  for (let i = 0; i < 3; i++) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: systemPrompt,
      tools: REFLECTION_TOOLS,
      messages: claudeMessages,
    })

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
      const textBlock = response.content.find(
        (block): block is Anthropic.TextBlock => block.type === 'text',
      )
      return { text: textBlock?.text ?? '', reflectionRecorded }
    }

    const toolResults: Anthropic.ToolResultBlockParam[] = []
    for (const toolBlock of toolUseBlocks) {
      if (toolBlock.name === 'complete_reflection') {
        try {
          await executeCompleteReflection(
            db,
            userId,
            actionId,
            interactionId,
            toolBlock.input as unknown as Parameters<typeof executeCompleteReflection>[4],
          )
          reflectionRecorded = true
          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolBlock.id,
            content: JSON.stringify({ success: true }),
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

    claudeMessages = [
      ...claudeMessages,
      { role: 'assistant' as const, content: response.content },
      { role: 'user' as const, content: toolResults },
    ]
  }

  return { text: 'Thanks for sharing. This reflection has been recorded.', reflectionRecorded }
}
