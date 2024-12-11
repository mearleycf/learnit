import { jsonSerializableSchema } from '@utils/general_utils'
import { z } from 'zod'

export const noteSchema = z.object({
  id: z.string().ulid(),
  student_id: z.string().ulid(),
  section_id: z.string().ulid(),
  note_text: jsonSerializableSchema.optional(),
  highlighted_text: z.unknown().optional(),
  created_at: z.date(),
  updated_at: z.date(),
})
