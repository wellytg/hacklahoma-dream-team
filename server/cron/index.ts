/**
 * Cron handler entry point.
 *
 * Dispatches Cloudflare Workers scheduled events to the appropriate handlers.
 */

import { processFollowUpChecks } from './follow-up-handler'

export async function handleScheduled(
  _controller: ScheduledController,
  env: Cloudflare.Env,
  _ctx: ExecutionContext,
): Promise<void> {
  await processFollowUpChecks(env)
}
