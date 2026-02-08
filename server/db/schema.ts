import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  googleId: text('google_id').unique().notNull(),
  googleAccessToken: text('google_access_token'),
  googleRefreshToken: text('google_refresh_token'),
  googleTokenExpiry: integer('google_token_expiry'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

// ─── User Profiles ───────────────────────────────────────────────────────────

export const userProfiles = sqliteTable('user_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).unique().notNull(),
  intent: text('intent'),                      // JSON array as text
  mode: text('mode'),                           // COACH | IGNITION | PACER | STABILIZER | ADAPTIVE
  drains: text('drains'),
  capabilities: text('capabilities'),
  avoidanceRoot: text('avoidance_root'),
  structurePref: text('structure_pref'),
  valueAlignment: text('value_alignment'),
  focusTime: text('focus_time'),
  workBurst: text('work_burst'),
  recovery: text('recovery'),
  learnStyle: text('learn_style'),
  feedbackPref: text('feedback_pref'),
  reminderPref: text('reminder_pref'),
  accessNeeds: text('access_needs'),            // JSON array as text
  resolvedState: text('resolved_state'),        // JSON blob
  notificationTolerance: text('notification_tolerance'), // high | medium | low
  preferredOutreach: text('preferred_outreach'),         // JSON array as text
  nudgePreference: text('nudge_preference'),             // active | passive | escalating
  intakeCompletedAt: text('intake_completed_at'),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

// ─── Interactions ────────────────────────────────────────────────────────────

export const interactions = sqliteTable('interactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(),                 // sensei_session | reflection
  status: text('status').default('active'),     // active | completed | abandoned
  summary: text('summary'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
  completedAt: text('completed_at'),
}, (table) => [
  index('interactions_user_id_idx').on(table.userId),
]);

// ─── Messages ────────────────────────────────────────────────────────────────

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  interactionId: text('interaction_id').references(() => interactions.id).notNull(),
  role: text('role').notNull(),                 // user | assistant | system
  content: text('content').notNull(),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
}, (table) => [
  index('messages_interaction_id_idx').on(table.interactionId),
]);

// ─── Scheduled Actions ───────────────────────────────────────────────────────

export const scheduledActions = sqliteTable('scheduled_actions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  interactionId: text('interaction_id').references(() => interactions.id),
  calendarEventId: text('calendar_event_id'),
  reflectionEventId: text('reflection_event_id'),
  title: text('title').notNull(),
  description: text('description'),
  scheduledAt: text('scheduled_at').notNull(),
  durationMinutes: integer('duration_minutes').default(30),
  goalArea: text('goal_area'),
  goalContext: text('goal_context'),
  reflectionScheduledAt: text('reflection_scheduled_at'),
  followUpScheduledAt: text('follow_up_scheduled_at'),
  status: text('status').default('pending'),    // pending | completed | missed | cancelled
  createdAt: text('created_at').default(sql`(datetime('now'))`),
}, (table) => [
  index('scheduled_actions_user_id_idx').on(table.userId),
  index('scheduled_actions_status_idx').on(table.status),
]);

// ─── Reflection Records ──────────────────────────────────────────────────────

export const reflectionRecords = sqliteTable('reflection_records', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  actionId: text('action_id').references(() => scheduledActions.id).notNull(),
  interactionId: text('interaction_id').references(() => interactions.id),
  completed: text('completed').notNull(),       // yes | no | partial
  userSummary: text('user_summary'),
  barriers: text('barriers'),                   // JSON array as text
  emotionalTone: text('emotional_tone'),        // positive | neutral | negative | mixed
  wantsToRepeat: text('wants_to_repeat'),       // yes | no | unsure
  agentNotes: text('agent_notes'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
}, (table) => [
  index('reflection_records_user_id_idx').on(table.userId),
  index('reflection_records_action_id_idx').on(table.actionId),
]);

// ─── Follow-Up Checks ───────────────────────────────────────────────────────

export const followUpChecks = sqliteTable('follow_up_checks', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  actionId: text('action_id').references(() => scheduledActions.id).notNull(),
  reflectionFound: integer('reflection_found'),  // 0 | 1 boolean
  strategyApplied: text('strategy_applied'),     // active_outreach | passive_record | custom
  outreachChannel: text('outreach_channel'),
  outreachTone: text('outreach_tone'),
  outreachContent: text('outreach_content'),
  scheduledAt: text('scheduled_at').notNull(),
  executedAt: text('executed_at'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
}, (table) => [
  index('follow_up_checks_user_id_idx').on(table.userId),
  index('follow_up_checks_action_id_idx').on(table.actionId),
]);
