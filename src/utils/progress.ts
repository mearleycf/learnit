import { db } from '@db/client'
import { student_progress, users } from '@db/schema'
import { and, eq } from 'drizzle-orm'

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
