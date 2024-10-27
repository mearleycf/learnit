// db/config/seed/utils.ts
import type { ExerciseConfig } from '../types/seed-types'
import { courseDateOptions } from './date-options'
import { ulid } from 'ulidx'
import { millisecondsPerDayCalc } from '@utils/general_utils'

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

const milliseconds = millisecondsPerDayCalc()
export const calculateExpirationDate = (purchaseDate: Date, activeLengthInDays: number): Date | null => {
    if (!activeLengthInDays) return null;
    return new Date(purchaseDate.getTime() + (activeLengthInDays * milliseconds))
}
