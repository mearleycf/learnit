import { z } from 'zod'

const lessonEntrySchema = z
  .object({
    markdown: z.string(),
    references: z.array(z.string()).optional(),
  })
  .optional()

const recapEntrySchema = z
  .object({
    summary: z.string(),
    key_points: z.array(z.string()),
  })
  .optional()

export const sectionSchema = z.object({
  id: z.string().ulid(),
  course_id: z.string().ulid(),
  chapter_id: z.string().ulid(),
  title: z.string(),
  description: z.string(),
  section_display_number: z.number(),
  sort_order: z.number(),
  content_type: z.string(),
  content: z.discriminatedUnion('content_type', [
    z.object({
      content_type: z.literal('lesson'),
      lessonEntrySchema,
    }),
    z.object({
      content_type: z.literal('recap'),
      recapEntrySchema,
    }),
    z.object({
      content_type: z.literal('exercise'),
    }),
  ]),
  access_level: z.enum(['purchased', 'free']).default('purchased'),
  created_at: z.date(),
  updated_at: z.date(),
})
