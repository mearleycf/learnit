import { z } from 'zod'

export const FEEDBACK_STATUSES = [
  'submitted',
  'assigned',
  'in_progress',
  'pending_publication',
  'resolved',
  'no_action_required',
] as const

export const FEEDBACK_CATEGORIES = [
  'incorrect_content',
  'general_feedback',
  'technical_issue',
  'feature_request',
  'clarity_improvement',
  'typo_or_grammar',
] as const

export const feedbackStatusSchema = z.enum(FEEDBACK_STATUSES)
export const feedbackCategorySchema = z.enum(FEEDBACK_CATEGORIES)

/**
 * Body of a feedback report.
 *
 * Stored in the `feedback_text` JSON column. Previously this accepted any
 * JSON-serialisable value, which meant nothing could rely on its shape.
 */
export const feedbackBodySchema = z.object({
  markdown: z.string().min(1).max(10_000),
})

export const feedbackSchema = z.object({
  id: z.ulid(),
  student_id: z.ulid(),
  section_id: z.ulid(),
  assigned_to_id: z.ulid().nullable().optional(),
  feedback_text: feedbackBodySchema,
  rating: z.number().int().min(1).max(5).nullable().optional(),
  status: feedbackStatusSchema,
  category: feedbackCategorySchema.nullable().optional(),
  admin_notes: z.string().nullable().optional(),
  github_issue_link: z.url().nullable().optional(),
  created_at: z.date(),
  updated_at: z.date(),
})

/** Statuses that still need someone to act. */
export const OPEN_STATUSES = ['submitted', 'assigned', 'in_progress', 'pending_publication'] as const

export const isOpen = (status: string): boolean => (OPEN_STATUSES as readonly string[]).includes(status)

/** Human labels, so pages do not format enum values themselves. */
export const STATUS_LABELS: Record<(typeof FEEDBACK_STATUSES)[number], string> = {
  submitted: 'Submitted',
  assigned: 'Assigned',
  in_progress: 'In progress',
  pending_publication: 'Pending publication',
  resolved: 'Resolved',
  no_action_required: 'No action required',
}

export const CATEGORY_LABELS: Record<(typeof FEEDBACK_CATEGORIES)[number], string> = {
  incorrect_content: 'Incorrect content',
  general_feedback: 'General feedback',
  technical_issue: 'Technical issue',
  feature_request: 'Feature request',
  clarity_improvement: 'Clarity',
  typo_or_grammar: 'Typo or grammar',
}
