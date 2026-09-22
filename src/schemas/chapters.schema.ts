import { z } from 'zod'

export const chapterSchema = z.object({
  id: z.ulid(),
  course_id: z.ulid(),
  title: z.string(),
  description: z.string(),
  chapter_display_number: z.number(),
  sort_order: z.number(),
  estimated_time_minutes: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
})
