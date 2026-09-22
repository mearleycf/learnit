import { sql } from 'drizzle-orm'
import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * Timestamp helpers.
 *
 * Astro DB's `column.date({ default: NOW })` is expressed here as a unix
 * timestamp column defaulting to `unixepoch()`. Drizzle hands these back as
 * JavaScript `Date` objects via `mode: 'timestamp'`.
 */
const createdAt = () =>
  integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)

const updatedAt = () =>
  integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
    // Replaces the former SQL triggers in db/triggers.ts, which updated the
    // users table on every table's UPDATE due to a copy-paste error.
    .$onUpdate(() => new Date())

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  avatar_url: text('avatar_url'),
  role: text('role', { enum: ['student', 'author', 'course_admin', 'app_admin'] })
    .notNull()
    .default('student'),
  /** ULIDs of courses a student is enrolled in. */
  enrolled_courses: text('enrolled_courses', { mode: 'json' }).$type<string[]>().default([]),
  /** ULIDs of courses assigned to a course_admin, app_admin or author. */
  assigned_courses: text('assigned_courses', { mode: 'json' }).$type<string[]>().default([]),
  auth_provider: text('auth_provider'),
  auth_provider_id: text('auth_provider_id'),
  github_username: text('github_username'),
  google_id: text('google_id'),
  gitlab_username: text('gitlab_username'),
  bitbucket_username: text('bitbucket_username'),
  last_sign_in: integer('last_sign_in', { mode: 'timestamp' }),
  created_at: createdAt(),
  updated_at: updatedAt(),
})

export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  slug: text('slug').notNull().unique(),
  subject_area: text('subject_area').notNull(),
  level: text('level', { enum: ['beginner', 'intermediate', 'advanced'] }).notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>().notNull().default([]),
  /** Stored as REAL; validated to precision 10, scale 2 by the zod schema. */
  price: real('price'),
  purchase_active_length: integer('purchase_active_length'),
  created_at: createdAt(),
  updated_at: updatedAt(),
})

export const chapters = sqliteTable(
  'chapters',
  {
    id: text('id').primaryKey(),
    course_id: text('course_id')
      .notNull()
      .references(() => courses.id),
    title: text('title').notNull(),
    description: text('description').notNull(),
    chapter_display_number: integer('chapter_display_number').notNull(),
    sort_order: integer('sort_order').notNull(),
    estimated_time_minutes: integer('estimated_time_minutes').notNull(),
    created_at: createdAt(),
    updated_at: updatedAt(),
  },
  table => [index('chapter_course_id_idx').on(table.course_id), index('chapter_sort_order_idx').on(table.sort_order)],
)

export const sections = sqliteTable(
  'sections',
  {
    id: text('id').primaryKey(),
    course_id: text('course_id')
      .notNull()
      .references(() => courses.id),
    chapter_id: text('chapter_id')
      .notNull()
      .references(() => chapters.id),
    title: text('title').notNull(),
    description: text('description').notNull(),
    section_display_number: integer('section_display_number').notNull(),
    sort_order: integer('sort_order').notNull(),
    content_type: text('content_type', { enum: ['lesson', 'recap', 'exercise'] }).notNull(),
    content: text('content', { mode: 'json' }),
    access_level: text('access_level', { enum: ['purchased', 'free'] })
      .notNull()
      .default('purchased'),
    created_at: createdAt(),
    updated_at: updatedAt(),
  },
  table => [
    index('section_chapter_id_idx').on(table.chapter_id),
    index('section_course_id_idx').on(table.course_id),
    index('section_sort_order_idx').on(table.sort_order),
  ],
)

export const exercises = sqliteTable(
  'exercises',
  {
    id: text('id').primaryKey(),
    section_id: text('section_id')
      .notNull()
      .references(() => sections.id),
    exercise_display_number: integer('exercise_display_number').notNull(),
    sort_order: integer('sort_order').notNull(),
    instructions: text('instructions').notNull(),
    browser_html: text('browser_html', { mode: 'json' }).notNull(),
    code_files: text('code_files', { mode: 'json' }).notNull(),
    tests: text('tests', { mode: 'json' }).notNull(),
    hints: text('hints', { mode: 'json' }).notNull(),
    difficulty: text('difficulty', { enum: ['easy', 'medium', 'hard'] }).notNull(),
    default_solution: text('default_solution', { mode: 'json' }).notNull(),
    student_solution: text('student_solution', { mode: 'json' }).notNull(),
    estimated_time_minutes: integer('estimated_time_minutes').notNull(),
    created_at: createdAt(),
    updated_at: updatedAt(),
  },
  table => [
    index('exercise_section_id_idx').on(table.section_id),
    index('exercise_sort_order_idx').on(table.sort_order),
  ],
)

export const feedback = sqliteTable(
  'feedback',
  {
    id: text('id').primaryKey(),
    student_id: text('student_id')
      .notNull()
      .references(() => users.id),
    section_id: text('section_id')
      .notNull()
      .references(() => sections.id),
    assigned_to_id: text('assigned_to_id').references(() => users.id),
    feedback_text: text('feedback_text', { mode: 'json' }).notNull(),
    rating: integer('rating'),
    status: text('status', {
      enum: ['submitted', 'assigned', 'in_progress', 'pending_publication', 'resolved', 'no_action_required'],
    }).notNull(),
    category: text('category', {
      enum: [
        'incorrect_content',
        'general_feedback',
        'technical_issue',
        'feature_request',
        'clarity_improvement',
        'typo_or_grammar',
      ],
    }),
    admin_notes: text('admin_notes'),
    github_issue_link: text('github_issue_link'),
    created_at: createdAt(),
    updated_at: updatedAt(),
  },
  table => [
    index('feedback_section_id_idx').on(table.section_id),
    index('feedback_student_id_idx').on(table.student_id),
    index('feedback_assigned_to_id_idx').on(table.assigned_to_id),
  ],
)

export const notes = sqliteTable(
  'notes',
  {
    id: text('id').primaryKey(),
    student_id: text('student_id')
      .notNull()
      .references(() => users.id),
    section_id: text('section_id')
      .notNull()
      .references(() => sections.id),
    note_text: text('note_text', { mode: 'json' }).default({}),
    highlighted_text: text('highlighted_text', { mode: 'json' }).default({}),
    created_at: createdAt(),
    updated_at: updatedAt(),
  },
  table => [index('notes_section_id_idx').on(table.section_id), index('notes_user_id_idx').on(table.student_id)],
)

export const student_exercise_progress = sqliteTable(
  'student_exercise_progress',
  {
    id: text('id').primaryKey(),
    student_id: text('student_id')
      .notNull()
      .references(() => users.id),
    exercise_id: text('exercise_id')
      .notNull()
      .references(() => exercises.id),
    score: integer('score').default(0),
    completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
    attempts: integer('attempts').notNull().default(0),
    last_attempt_at: integer('last_attempt_at', { mode: 'timestamp' }),
    created_at: createdAt(),
    updated_at: updatedAt(),
  },
  table => [
    index('student_exercise_progress_exercise_id_idx').on(table.exercise_id),
    index('student_exercise_progress_student_id_idx').on(table.student_id),
  ],
)

export const student_progress = sqliteTable(
  'student_progress',
  {
    id: text('id').primaryKey(),
    student_id: text('student_id')
      .notNull()
      .references(() => users.id),
    course_id: text('course_id')
      .notNull()
      .references(() => courses.id),
    current_section_id: text('current_section_id')
      .notNull()
      .references(() => sections.id),
    completed_sections: text('completed_sections', { mode: 'json' }).$type<string[]>().notNull().default([]),
    last_accessed_at: integer('last_accessed_at', { mode: 'timestamp' }),
    enrollment_date: integer('enrollment_date', { mode: 'timestamp' }).notNull(),
    purchase_date: integer('purchase_date', { mode: 'timestamp' }),
    expiration_date: integer('expiration_date', { mode: 'timestamp' }),
    created_at: createdAt(),
    updated_at: updatedAt(),
  },
  table => [
    index('student_progress_student_id_idx').on(table.student_id),
    index('student_progress_course_id_idx').on(table.course_id),
    index('student_progress_current_section_id_idx').on(table.current_section_id),
  ],
)
