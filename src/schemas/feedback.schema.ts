import { z } from 'zod'

export const feedbackSchema = z.object({
  id: z.string().ulid(),
  student_id: z.string().ulid(),
  section_id: z.string().ulid(),
  assigned_to_id: z.string().ulid().optional(),
  feedback_text: z.unknown(),
  rating: z.number().optional(),
  status: z.enum(['submitted', 'assigned', 'in_progress', 'pending_publication', 'resolved', 'no_action_required']),
  categories: z
    .enum([
      'incorrect_content',
      'general_feedback',
      'technical_issue',
      'feature_request',
      'clarity_improvement',
      'typo_or_grammar',
    ])
    .optional(),
  admin_notes: z.string().optional(),
  github_issue_link: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
})
