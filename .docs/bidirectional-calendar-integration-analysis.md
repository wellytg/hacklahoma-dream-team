Calendar Bidirectional Sync — Feasibility Assessment                  
                                                                        
  Google Calendar supports push notifications via
  https://developers.google.com/calendar/api/guides/push. Here's how it
  would work:

  What's needed:
  1. A new endpoint (e.g., /api/calendar/webhook) to receive Google's
  POST notifications
  2. A watch API call when a user first connects, creating a
  notification channel for their primary calendar
  3. Channel renewal logic — watches expire (max ~7 days), so the
  existing cron job would need to renew them
  4. On notification: fetch the changed event, match it to our
  scheduledActions by calendarEventId, and sync the changes (title,
  time, description)

  Challenges:
  - Infinite loop prevention — when our app updates a calendar event,
  Google fires a webhook. We'd need to track "our" changes and skip
  them.
  - Watch expiration — channels expire and must be renewed periodically.
  - User edits in Google Calendar — if a user moves the event time, we
  need to update scheduledAt in our DB. Deletions would need to be
  handled too.
  - Schema additions — we'd need a calendarSyncToken and watchChannelId
  per user.

  Verdict: Moderate complexity. The core webhook integration is
  straightforward on Cloudflare Workers, but handling edge cases (loop
  prevention, expiration, deletions, conflict resolution) adds real
  work. Probably a 4-6 hour effort. Worth doing if calendar integration
  is a core feature, but not essential for a hackathon demo.

  Want me to implement it, or should we skip it for now?

✻ Churned for 5m 19s

❯ skip it for now, commit, push, and deploy
