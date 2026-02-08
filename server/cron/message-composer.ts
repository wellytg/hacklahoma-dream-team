/**
 * Claude-powered follow-up message composition.
 *
 * Generates a short, calibrated follow-up message for missed reflections.
 * MVP: records the message but does NOT actually send it anywhere.
 */

import Anthropic from '@anthropic-ai/sdk'

interface ComposeInput {
  actionTitle: string
  goalArea?: string
  notificationTolerance: string
  personaMode: string
}

interface ComposeResult {
  message: string
  tone: string
}

export async function composeFollowUpMessage(
  input: ComposeInput,
  apiKey: string,
): Promise<ComposeResult> {
  const client = new Anthropic({ apiKey })

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 256,
    system: `You compose brief, warm follow-up messages for a personal growth app called Sensei.
The user had a scheduled action they didn't reflect on. Write a 1-2 sentence follow-up message.

Rules:
- Match the notification tolerance: "high" = direct and specific, "medium" = warm but brief, "low" = very gentle and minimal
- Never guilt or shame
- Be encouraging and forward-looking
- Reference the action naturally

Respond with JSON: {"message": "...", "tone": "gentle|warm|direct"}`,
    messages: [
      {
        role: 'user',
        content: `Action: "${input.actionTitle}"${input.goalArea ? ` (${input.goalArea})` : ''}
Notification tolerance: ${input.notificationTolerance}
Persona mode: ${input.personaMode}

Compose the follow-up message.`,
      },
    ],
  })

  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === 'text',
  )

  try {
    const parsed = JSON.parse(textBlock?.text ?? '{}')
    return {
      message: parsed.message ?? "Hey — whenever you're ready, I'd love to hear how it went.",
      tone: parsed.tone ?? 'warm',
    }
  } catch {
    return {
      message: "Hey — whenever you're ready, I'd love to hear how it went.",
      tone: 'warm',
    }
  }
}
