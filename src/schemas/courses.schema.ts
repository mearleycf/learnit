import { createPrecisionScaleRefinement, createPrecisionScaleMessage } from '@utils/general_utils'
import { z } from 'zod'

export const courseSchema = z.object({
  id: z.string().ulid(),
  title: z.string().min(4),
  description: z.string(),
  slug: z.string(),
  subject_area: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  tags: z.array(z.string()),
  price: z
    .number()
    .positive()
    .optional()
    .refine(createPrecisionScaleRefinement(10, 2), createPrecisionScaleMessage(10, 2)),
  purchase_active_length: z.number().positive().optional(),
  created_at: z.date(),
  updated_at: z.date(),
})
