/**
 * Custom server entry for Cloudflare Workers.
 *
 * Re-exports TanStack Start's fetch handler and adds scheduled() for cron jobs.
 */

import handler from '@tanstack/react-start/server-entry'
import { handleScheduled } from '../server/cron'

export default {
  fetch: handler.fetch,
  scheduled: handleScheduled,
}
