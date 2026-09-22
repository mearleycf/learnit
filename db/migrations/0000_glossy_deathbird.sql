CREATE TABLE `chapters` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`chapter_display_number` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`estimated_time_minutes` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `chapter_course_id_idx` ON `chapters` (`course_id`);--> statement-breakpoint
CREATE INDEX `chapter_sort_order_idx` ON `chapters` (`sort_order`);--> statement-breakpoint
CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`slug` text NOT NULL,
	`subject_area` text NOT NULL,
	`level` text NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`price` real,
	`purchase_active_length` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courses_slug_unique` ON `courses` (`slug`);--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`section_id` text NOT NULL,
	`exercise_display_number` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`instructions` text NOT NULL,
	`browser_html` text NOT NULL,
	`code_files` text NOT NULL,
	`tests` text NOT NULL,
	`hints` text NOT NULL,
	`difficulty` text NOT NULL,
	`default_solution` text NOT NULL,
	`student_solution` text NOT NULL,
	`estimated_time_minutes` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `exercise_section_id_idx` ON `exercises` (`section_id`);--> statement-breakpoint
CREATE INDEX `exercise_sort_order_idx` ON `exercises` (`sort_order`);--> statement-breakpoint
CREATE TABLE `feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`section_id` text NOT NULL,
	`assigned_to_id` text,
	`feedback_text` text NOT NULL,
	`rating` integer,
	`status` text NOT NULL,
	`category` text,
	`admin_notes` text,
	`github_issue_link` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `feedback_section_id_idx` ON `feedback` (`section_id`);--> statement-breakpoint
CREATE INDEX `feedback_student_id_idx` ON `feedback` (`student_id`);--> statement-breakpoint
CREATE INDEX `feedback_assigned_to_id_idx` ON `feedback` (`assigned_to_id`);--> statement-breakpoint
CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`section_id` text NOT NULL,
	`note_text` text DEFAULT '{}',
	`highlighted_text` text DEFAULT '{}',
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `notes_section_id_idx` ON `notes` (`section_id`);--> statement-breakpoint
CREATE INDEX `notes_user_id_idx` ON `notes` (`student_id`);--> statement-breakpoint
CREATE TABLE `sections` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`chapter_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`section_display_number` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`content_type` text NOT NULL,
	`content` text,
	`access_level` text DEFAULT 'purchased' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `section_chapter_id_idx` ON `sections` (`chapter_id`);--> statement-breakpoint
CREATE INDEX `section_course_id_idx` ON `sections` (`course_id`);--> statement-breakpoint
CREATE INDEX `section_sort_order_idx` ON `sections` (`sort_order`);--> statement-breakpoint
CREATE TABLE `student_exercise_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`score` integer DEFAULT 0,
	`completed` integer DEFAULT false NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`last_attempt_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `student_exercise_progress_exercise_id_idx` ON `student_exercise_progress` (`exercise_id`);--> statement-breakpoint
CREATE INDEX `student_exercise_progress_student_id_idx` ON `student_exercise_progress` (`student_id`);--> statement-breakpoint
CREATE TABLE `student_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`course_id` text NOT NULL,
	`current_section_id` text NOT NULL,
	`completed_sections` text DEFAULT '[]' NOT NULL,
	`last_accessed_at` integer,
	`enrollment_date` integer NOT NULL,
	`purchase_date` integer,
	`expiration_date` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`current_section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `student_progress_student_id_idx` ON `student_progress` (`student_id`);--> statement-breakpoint
CREATE INDEX `student_progress_course_id_idx` ON `student_progress` (`course_id`);--> statement-breakpoint
CREATE INDEX `student_progress_current_section_id_idx` ON `student_progress` (`current_section_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`avatar_url` text,
	`role` text DEFAULT 'student' NOT NULL,
	`enrolled_courses` text DEFAULT '[]',
	`assigned_courses` text DEFAULT '[]',
	`auth_provider` text,
	`auth_provider_id` text,
	`github_username` text,
	`google_id` text,
	`gitlab_username` text,
	`bitbucket_username` text,
	`last_sign_in` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);