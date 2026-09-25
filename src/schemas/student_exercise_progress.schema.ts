import { z } from 'zod'

export const studentExerciseProgressSchema = z.object({
  id: z.ulid(),
  student_id: z.ulid(),
  exercise_id: z.ulid(),
  score: z.number().optional().default(0),
  completed: z.boolean().default(false),
  attempts: z.number().default(0),
  last_attempt_at: z.date().optional(),
  created_at: z.date(),
  updated_at: z.date(),
})
