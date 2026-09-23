import { db } from '@db/client'
import { student_exercise_progress, student_progress, users } from '@db/schema'
import { and, eq } from 'drizzle-orm'
import { ulid } from 'ulidx'

export type ProgressRow = typeof student_progress.$inferSelect

/**
 * The signed-in student.
 *
 * learnit is local and single-user, so there is no auth. This returns the one
 * seeded user. When auth arrives, this is the seam to replace.
 */
export const getCurrentUser = async () => {
  const [user] = await db.select().from(users).limit(1)
  return user ?? null
}

export const getProgress = async (userId: string, courseId: string): Promise<ProgressRow | null> => {
  const [row] = await db
    .select()
    .from(student_progress)
    .where(and(eq(student_progress.student_id, userId), eq(student_progress.course_id, courseId)))
    .limit(1)
  return row ?? null
}

/** Section IDs the student has finished, as a set for cheap lookup. */
export const completedSet = (progress: ProgressRow | null): Set<string> => new Set(progress?.completed_sections ?? [])

/**
 * Adds or removes a section from the student's completed list.
 *
 * Also moves `current_section_id` to the section just finished, so resuming
 * lands somewhere sensible. Returns the new completed state.
 */
export const setSectionComplete = async (
  userId: string,
  courseId: string,
  sectionId: string,
  complete: boolean,
): Promise<boolean> => {
  const progress = await getProgress(userId, courseId)
  if (!progress) return false

  const done = new Set(progress.completed_sections ?? [])
  if (complete) {
    done.add(sectionId)
  } else {
    done.delete(sectionId)
  }

  await db
    .update(student_progress)
    .set({
      completed_sections: [...done],
      current_section_id: sectionId,
      last_accessed_at: new Date(),
    })
    .where(eq(student_progress.id, progress.id))

  return complete
}

/** Percentage of a course's sections that are complete, rounded to an integer. */
export const percentComplete = (completed: number, total: number): number =>
  total === 0 ? 0 : Math.round((completed / total) * 100)

/**
 * Records one run of an exercise.
 *
 * Creates the row on first attempt. `attempts` only ever increases; `score`
 * and `completed` keep the student's best result, so a later failed run does
 * not undo a pass.
 */
export const recordExerciseAttempt = async (
  userId: string,
  exerciseId: string,
  passed: number,
  total: number,
  solution?: Record<string, string>,
): Promise<{ attempts: number; score: number; completed: boolean }> => {
  const score = total === 0 ? 0 : Math.round((passed / total) * 100)
  const completed = total > 0 && passed === total

  const [existing] = await db
    .select()
    .from(student_exercise_progress)
    .where(and(eq(student_exercise_progress.student_id, userId), eq(student_exercise_progress.exercise_id, exerciseId)))
    .limit(1)

  if (!existing) {
    await db.insert(student_exercise_progress).values({
      id: ulid(),
      student_id: userId,
      exercise_id: exerciseId,
      attempts: 1,
      score,
      completed,
      solution: solution ?? null,
      last_attempt_at: new Date(),
    })
    return { attempts: 1, score, completed }
  }

  const next = {
    attempts: existing.attempts + 1,
    score: Math.max(existing.score ?? 0, score),
    completed: existing.completed || completed,
  }

  await db
    .update(student_exercise_progress)
    .set({
      ...next,
      // Keep the last saved work if this run did not carry any.
      solution: solution ?? existing.solution,
      last_attempt_at: new Date(),
    })
    .where(eq(student_exercise_progress.id, existing.id))

  return next
}

export const getExerciseAttempts = async (userId: string, exerciseId: string) => {
  const [row] = await db
    .select()
    .from(student_exercise_progress)
    .where(and(eq(student_exercise_progress.student_id, userId), eq(student_exercise_progress.exercise_id, exerciseId)))
    .limit(1)
  return row ?? null
}

/**
 * Saves the student's work without counting it as an attempt.
 *
 * Called as they type, so a browser change or a cleared cache does not lose
 * the work. Creates the progress row if this is the first thing they do.
 */
export const saveExerciseSolution = async (
  userId: string,
  exerciseId: string,
  solution: Record<string, string>,
): Promise<void> => {
  const existing = await getExerciseAttempts(userId, exerciseId)

  if (!existing) {
    await db.insert(student_exercise_progress).values({
      id: ulid(),
      student_id: userId,
      exercise_id: exerciseId,
      attempts: 0,
      score: 0,
      completed: false,
      solution,
    })
    return
  }

  await db.update(student_exercise_progress).set({ solution }).where(eq(student_exercise_progress.id, existing.id))
}
