import { z } from 'zod'

/**
 * Body of a student's note.
 *
 * Stored in the `note_text` JSON column. Markdown so notes can carry code
 * snippets, which is the common case on a programming course.
 */
export const noteBodySchema = z.object({
  markdown: z.string().min(1).max(10_000),
})

/**
 * Passage of the lesson a note is anchored to.
 *
 * Stored in `highlighted_text`. Null for a free-standing note that is not
 * attached to any particular passage.
 */
export const noteHighlightSchema = z.object({
  quote: z.string().min(1).max(2_000),
})

export const noteSchema = z.object({
  id: z.ulid(),
  student_id: z.ulid(),
  section_id: z.ulid(),
  note_text: noteBodySchema.nullable().optional(),
  highlighted_text: noteHighlightSchema.nullable().optional(),
  created_at: z.date(),
  updated_at: z.date(),
})
