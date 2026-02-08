/**
 * Context builders for agent system prompts.
 *
 * Loads user data from the DB and formats it into structured context
 * strings that are injected into agent system prompts.
 */

import { eq, desc } from 'drizzle-orm';
import {
  users,
  userProfiles,
  interactions,
  messages,
  scheduledActions,
  reflectionRecords,
} from '../db/schema';
import type { Database } from '../db/index';

// ---------------------------------------------------------------------------
// Sensei context
// ---------------------------------------------------------------------------

/**
 * Build context for the Sensei agent: user profile, recent interactions
 * (with summaries), recent scheduled actions, and recent reflections.
 */
export async function buildSenseiContext(
  db: Database,
  userId: string,
): Promise<string> {
  const [user, profile, recentInteractions, recentActions, recentReflections] =
    await Promise.all([
      db.select({ name: users.name }).from(users).where(eq(users.id, userId)).get(),
      db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).get(),
      db
        .select({
          id: interactions.id,
          type: interactions.type,
          summary: interactions.summary,
          createdAt: interactions.createdAt,
        })
        .from(interactions)
        .where(eq(interactions.userId, userId))
        .orderBy(desc(interactions.createdAt))
        .limit(5),
      db
        .select()
        .from(scheduledActions)
        .where(eq(scheduledActions.userId, userId))
        .orderBy(desc(scheduledActions.createdAt))
        .limit(5),
      db
        .select()
        .from(reflectionRecords)
        .where(eq(reflectionRecords.userId, userId))
        .orderBy(desc(reflectionRecords.createdAt))
        .limit(5),
    ]);

  const sections: string[] = [];

  // User name
  if (user?.name) {
    sections.push(`## User\nName: ${user.name}`);
  }

  // Profile
  if (profile) {
    const profileLines: string[] = ['## User Profile'];
    if (profile.intent) profileLines.push(`Intent: ${profile.intent}`);
    if (profile.mode) profileLines.push(`Persona mode: ${profile.mode}`);
    if (profile.drains) profileLines.push(`Energy drains: ${profile.drains}`);
    if (profile.capabilities) profileLines.push(`Capabilities: ${profile.capabilities}`);
    if (profile.avoidanceRoot) profileLines.push(`Avoidance root: ${profile.avoidanceRoot}`);
    if (profile.structurePref) profileLines.push(`Structure preference: ${profile.structurePref}`);
    if (profile.valueAlignment) profileLines.push(`Value alignment: ${profile.valueAlignment}`);
    if (profile.focusTime) profileLines.push(`Focus time: ${profile.focusTime}`);
    if (profile.workBurst) profileLines.push(`Work burst style: ${profile.workBurst}`);
    if (profile.recovery) profileLines.push(`Recovery style: ${profile.recovery}`);
    if (profile.learnStyle) profileLines.push(`Learning style: ${profile.learnStyle}`);
    if (profile.feedbackPref) profileLines.push(`Feedback preference: ${profile.feedbackPref}`);
    if (profile.reminderPref) profileLines.push(`Reminder preference: ${profile.reminderPref}`);
    if (profile.resolvedState) profileLines.push(`Resolved state: ${profile.resolvedState}`);
    sections.push(profileLines.join('\n'));
  }

  // Recent interactions
  if (recentInteractions.length > 0) {
    const lines = recentInteractions.map(
      (i) => `- [${i.type}] ${i.createdAt}${i.summary ? `: ${i.summary}` : ''}`,
    );
    sections.push(`## Recent Interactions\n${lines.join('\n')}`);
  }

  // Recent scheduled actions
  if (recentActions.length > 0) {
    const lines = recentActions.map(
      (a) =>
        `- ${a.title} (${a.status}) — scheduled ${a.scheduledAt}${a.goalArea ? ` [${a.goalArea}]` : ''}`,
    );
    sections.push(`## Recent Scheduled Actions\n${lines.join('\n')}`);
  }

  // Recent reflections
  if (recentReflections.length > 0) {
    const lines = recentReflections.map(
      (r) =>
        `- Action ${r.actionId}: completed=${r.completed}, tone=${r.emotionalTone ?? 'unknown'}${r.userSummary ? ` — "${r.userSummary}"` : ''}`,
    );
    sections.push(`## Recent Reflections\n${lines.join('\n')}`);
  }

  return sections.join('\n\n');
}

// ---------------------------------------------------------------------------
// Reflection context
// ---------------------------------------------------------------------------

/**
 * Build context for the Reflection agent: user profile, the specific
 * scheduled action, and the interaction messages that led to it.
 */
export async function buildReflectionContext(
  db: Database,
  userId: string,
  actionId: string,
): Promise<string> {
  const [user, profile, action] = await Promise.all([
    db.select({ name: users.name }).from(users).where(eq(users.id, userId)).get(),
    db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).get(),
    db.select().from(scheduledActions).where(eq(scheduledActions.id, actionId)).get(),
  ]);

  const sections: string[] = [];

  if (user?.name) {
    sections.push(`## User\nName: ${user.name}`);
  }

  if (profile) {
    const profileLines: string[] = ['## User Profile'];
    if (profile.mode) profileLines.push(`Persona mode: ${profile.mode}`);
    if (profile.feedbackPref) profileLines.push(`Feedback preference: ${profile.feedbackPref}`);
    if (profile.avoidanceRoot) profileLines.push(`Avoidance root: ${profile.avoidanceRoot}`);
    if (profile.resolvedState) profileLines.push(`Resolved state: ${profile.resolvedState}`);
    sections.push(profileLines.join('\n'));
  }

  if (action) {
    sections.push(
      [
        '## Scheduled Action',
        `Title: ${action.title}`,
        `Description: ${action.description ?? 'N/A'}`,
        `Scheduled at: ${action.scheduledAt}`,
        `Goal area: ${action.goalArea ?? 'N/A'}`,
        `Goal context: ${action.goalContext ?? 'N/A'}`,
        `Status: ${action.status}`,
      ].join('\n'),
    );

    // Load messages from the interaction that created this action
    if (action.interactionId) {
      const msgs = await db
        .select({ role: messages.role, content: messages.content })
        .from(messages)
        .where(eq(messages.interactionId, action.interactionId))
        .orderBy(messages.createdAt)
        .limit(20);

      if (msgs.length > 0) {
        const lines = msgs.map((m) => `[${m.role}]: ${m.content}`);
        sections.push(`## Original Conversation\n${lines.join('\n')}`);
      }
    }
  }

  return sections.join('\n\n');
}
