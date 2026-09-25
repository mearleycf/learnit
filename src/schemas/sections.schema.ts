import { z } from 'zod'

const lessonEntrySchema = z.object({
  markdown: z.string(),
  references: z.array(z.string()).optional(),
})

const recapEntrySchema = z.object({
  summary: z.string(),
  key_points: z.array(z.string()),
})

/**
 * Payload stored in the `sections.content` JSON column.
 *
 * Discriminated on `content_type`, which mirrors the sibling column of the same
 * name. Each payload is optional because seeded sections are created before
 * their lesson copy is written.
 */
export const sectionContentSchema = z.discriminatedUnion('content_type', [
  z.object({
    content_type: z.literal('lesson'),
    lesson: lessonEntrySchema.optional(),
  }),
  z.object({
    content_type: z.literal('recap'),
    recap: recapEntrySchema.optional(),
  }),
  z.object({
    content_type: z.literal('exercise'),
  }),
])

export const sectionSchema = z.object({
  id: z.ulid(),
  course_id: z.ulid(),
  chapter_id: z.ulid(),
  title: z.string(),
  description: z.string(),
  section_display_number: z.number(),
  sort_order: z.number(),
  content_type: z.enum(['lesson', 'recap', 'exercise']),
  content: sectionContentSchema.nullable().optional(),
  access_level: z.enum(['purchased', 'free']).default('purchased'),
  created_at: z.date(),
  updated_at: z.date(),
})
