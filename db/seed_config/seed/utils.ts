import { millisecondsPerDayCalc } from '@utils/general_utils'
import type { ExerciseConfig } from '../types/seed-types'
import { courseDateOptions } from './date-options'
import { ulid } from 'ulidx'

/**
 * Creates exercise data for seeding the database.
 *
 * @param {number} seedSeq - The sequence number for the seed.
 * @param {number} displayNum - The display number for the exercise.
 * @param {string} instructions - The instructions for the exercise.
 * @param {string} [comment] - Optional comment for the exercise.
 * @returns {ExerciseConfig} - The configuration object for the exercise.
 */

export const createExerciseData = (
  seedSeq: number,
  displayNum: number,
  instructions: string,
  comment?: string,
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
  ...(comment && { comment }),
})

/**
 * Calculates the expiration date based on the purchase date and the active length in days.
 *
 * @param {Date} purchaseDate - The date when the purchase was made.
 * @param {number} activeLengthInDays - The number of days the purchase is active.
 * @returns {Date | null} - The calculated expiration date or null if the active length in days is not provided.
 */
const milliseconds = millisecondsPerDayCalc()
export const calculateExpirationDate = (purchaseDate: Date, activeLengthInDays: number): Date | null => {
  if (!activeLengthInDays) return null
  return new Date(purchaseDate.getTime() + activeLengthInDays * milliseconds)
}
