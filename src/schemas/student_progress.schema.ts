import { z } from 'zod'

export const studentProgressSchema = z.object({
  id: z.string().ulid(),
  student_id: z.string().ulid(),
  course_id: z.string().ulid(),
  current_section_id: z.string().ulid(),
  completed_sections: z.array(z.string().ulid()).default([]),
  last_accessed_at: z.date().optional(),
  enrollment_date: z.date(),
  purchase_date: z.date().optional(),
  expiration_date: z.date().optional(),
  created_at: z.date(),
  updated_at: z.date(),
})
