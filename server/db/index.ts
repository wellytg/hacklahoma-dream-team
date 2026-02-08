import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

/**
 * Create a Drizzle ORM instance from a Cloudflare D1 database binding.
 *
 * Usage in a Cloudflare Worker:
 *   const db = getDb(env.DB);
 */
export function getDb(d1: D1Database) {
  return drizzle(d1, { schema })
}

export type Database = ReturnType<typeof getDb>
