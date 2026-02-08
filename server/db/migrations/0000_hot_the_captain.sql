CREATE TABLE `follow_up_checks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`action_id` text NOT NULL,
	`reflection_found` integer,
	`strategy_applied` text,
	`outreach_channel` text,
	`outreach_tone` text,
	`outreach_content` text,
	`scheduled_at` text NOT NULL,
	`executed_at` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`action_id`) REFERENCES `scheduled_actions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `follow_up_checks_user_id_idx` ON `follow_up_checks` (`user_id`);--> statement-breakpoint
CREATE INDEX `follow_up_checks_action_id_idx` ON `follow_up_checks` (`action_id`);--> statement-breakpoint
CREATE TABLE `interactions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'active',
	`summary` text,
	`created_at` text DEFAULT (datetime('now')),
	`completed_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `interactions_user_id_idx` ON `interactions` (`user_id`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`interaction_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`interaction_id`) REFERENCES `interactions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `messages_interaction_id_idx` ON `messages` (`interaction_id`);--> statement-breakpoint
CREATE TABLE `reflection_records` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`action_id` text NOT NULL,
	`interaction_id` text,
	`completed` text NOT NULL,
	`user_summary` text,
	`barriers` text,
	`emotional_tone` text,
	`wants_to_repeat` text,
	`agent_notes` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`action_id`) REFERENCES `scheduled_actions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`interaction_id`) REFERENCES `interactions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `reflection_records_user_id_idx` ON `reflection_records` (`user_id`);--> statement-breakpoint
CREATE INDEX `reflection_records_action_id_idx` ON `reflection_records` (`action_id`);--> statement-breakpoint
CREATE TABLE `scheduled_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`interaction_id` text,
	`calendar_event_id` text,
	`reflection_event_id` text,
	`title` text NOT NULL,
	`description` text,
	`scheduled_at` text NOT NULL,
	`duration_minutes` integer DEFAULT 30,
	`goal_area` text,
	`goal_context` text,
	`reflection_scheduled_at` text,
	`follow_up_scheduled_at` text,
	`status` text DEFAULT 'pending',
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`interaction_id`) REFERENCES `interactions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `scheduled_actions_user_id_idx` ON `scheduled_actions` (`user_id`);--> statement-breakpoint
CREATE INDEX `scheduled_actions_status_idx` ON `scheduled_actions` (`status`);--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`intent` text,
	`mode` text,
	`drains` text,
	`capabilities` text,
	`avoidance_root` text,
	`structure_pref` text,
	`value_alignment` text,
	`focus_time` text,
	`work_burst` text,
	`recovery` text,
	`learn_style` text,
	`feedback_pref` text,
	`reminder_pref` text,
	`access_needs` text,
	`resolved_state` text,
	`notification_tolerance` text,
	`preferred_outreach` text,
	`nudge_preference` text,
	`intake_completed_at` text,
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_profiles_user_id_unique` ON `user_profiles` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`google_id` text NOT NULL,
	`google_access_token` text,
	`google_refresh_token` text,
	`google_token_expiry` integer,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_id_unique` ON `users` (`google_id`);