// db/config/seed/utils.ts
import type { ExerciseConfig } from '../types/seed-types'
import { courseDateOptions } from './date-options'
import { ulid } from 'ulidx'

export const createExerciseData = (
  seedSeq: number, 
  displayNum: number, 
  instructions: string, 
  comment?: string
): ExerciseConfig => ({
  id: ulid(),
  seedSequence: seedSeq,
  exercise_display_number: displayNum,
  instructions,
  browser_html: {},
  code_files: {},
  tests: {},
  hints: {},
  difficulty: null,
  default_solution: {},
  student_solution: {},
  estimated_time_minutes: 0,
  dateConfig: courseDateOptions.exercises,
  ...(comment && { comment })
})
