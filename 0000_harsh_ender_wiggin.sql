CREATE TABLE `indicator_updates` (
	`indicator_id` text PRIMARY KEY NOT NULL,
	`actual_value` real,
	`notes` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `project_updates` (
	`project_id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'pendent' NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`start_date` text,
	`end_date` text,
	`next_milestone` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
