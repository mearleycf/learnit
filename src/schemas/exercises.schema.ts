import { jsonSerializableSchema } from '@utils/general_utils'
import { z } from 'zod'

const browserHtmlEntrySchema = z.object({
  filename: z.string(),
  content: z.string(),
  isHidden: z.boolean().default(false),
})

const browserHtmlSchema = z
  .object({
    files: z.array(browserHtmlEntrySchema),
    defaultView: z.string().optional(),
  })
  .optional()

const codeFileEntrySchema = z.object({
  filename: z.string(),
  language: z.enum([
    'javascript',
    'typescript',
    'python',
    'ruby',
    'java',
    'c',
    'c++',
    'c#',
    'go',
    'rust',
    'kotlin',
    'swift',
    'php',
    'sql',
    'shell',
    'powershell',
    'plaintext',
  ]),
  content: jsonSerializableSchema,
  isReadOnly: z.boolean().default(false),
  isHidden: z.boolean().default(false),
})

const codeFileSchema = z.object({
  files: z.array(codeFileEntrySchema),
  defaultView: z.string().optional(),
})

const testEntrySchema = z.object({
  name: z.string(),
  testFunction: z.string(),
  description: z.string(),
  expectedOutput: jsonSerializableSchema,
  timeout: z.number().optional(),
})

const testSchema = z.object({
  tests: z.array(testEntrySchema),
})

const hintEntrySchema = z.object({
  order: z.number(),
  content: jsonSerializableSchema,
  type: z.enum(['text', 'code', 'image']).default('text'),
  showAfterAttempts: z.number().optional(),
})

const hintSchema = z.object({
  hints: z.array(hintEntrySchema),
})

const defaultSolutionSchema = z.object({
  content: jsonSerializableSchema,
  explanation: jsonSerializableSchema,
})

const studentSolutionSchema = z.object({
  content: jsonSerializableSchema,
  explanation: jsonSerializableSchema,
})

export const exerciseSchema = z.object({
  id: z.string().ulid(),
  section_id: z.string().ulid(),
  exercise_display_number: z.number(),
  sort_order: z.number(),
  instructions: z.string(),
  browser_html: browserHtmlSchema,
  code_files: codeFileSchema,
  tests: testSchema,
  hints: hintSchema,
  difficulty: z.enum(['easy', 'medium', 'hard']),
  default_solution: defaultSolutionSchema,
  student_solution: studentSolutionSchema,
  estimated_time_minutes: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
})
