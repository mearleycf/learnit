import { z } from 'zod'

export const studentProgressSchema = z.object({
  id: z.ulid(),
  student_id: z.ulid(),
  course_id: z.ulid(),
  current_section_id: z.ulid(),
  completed_sections: z.array(z.ulid()).default([]),
  last_accessed_at: z.date().optional(),
  enrollment_date: z.date(),
  purchase_date: z.date().optional(),
  expiration_date: z.date().optional(),
  created_at: z.date(),
  updated_at: z.date(),
})
