import { sectionContentSchema } from '@schemas/sections.schema'

import { client, db } from './client'
import {
  chapters,
  courses,
  exercises,
  feedback,
  notes,
  sections,
  student_exercise_progress,
  student_progress,
  users,
} from './schema'
import { courseData } from './seed_config/seed/courses/index'
import { seedDate, seedUlid } from './seed_config/seed/deterministic'
import type { ExerciseDifficulty } from './seed_config/types/seed-types'

const DIFFICULTIES: ExerciseDifficulty[] = ['easy', 'medium', 'hard']

/**
 * Normalises and validates a section's authored content.
 *
 * Seed files historically used `{}` to mean "not written yet", which is not a
 * valid payload. That is stored as NULL so the gap is visible in the data
 * rather than hidden behind an empty object. Anything else must satisfy
 * sectionContentSchema, and a failure aborts the seed with the section named.
 */
export const resolveContent = (raw: unknown, sectionKey: string): unknown => {
  if (raw == null) return null
  if (typeof raw === 'object' && Object.keys(raw as object).length === 0) return null

  const parsed = sectionContentSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error(`Invalid content for ${sectionKey}: ${JSON.stringify(parsed.error.issues, null, 2)}`)
  }
  return parsed.data
}

/** Parses a human-authored duration such as "3 hours" or "45 minutes" into minutes. */
const parseEstimatedTime = (value: string | undefined, fallback = 60): number => {
  if (!value) return fallback
  const match = /(\d+(?:\.\d+)?)\s*(hour|hr|minute|min)/i.exec(value)
  if (!match?.[1] || !match[2]) return fallback
  const amount = Number(match[1])
  return /^h/i.test(match[2]) ? Math.round(amount * 60) : Math.round(amount)
}

/**
 * Stable created/updated pair for an entity, derived from its natural key.
 *
 * `updated_at` always lands at or after `created_at`.
 */
const dates = (key: string, daysBefore: number, daysAfter: number) => {
  const created_at = seedDate(key, daysBefore, daysAfter)
  const updated = seedDate(`${key}:updated`, daysBefore, daysAfter)
  return { created_at, updated_at: updated > created_at ? updated : created_at }
}

/**
 * Wipes every table and reinserts the authored course data.
 *
 * Deletes run child-first so foreign keys stay satisfied. Chapter, section and
 * exercise rows derive their parent ids and sort order here rather than in the
 * seed files.
 */
export const seedDb = async (): Promise<void> => {
  console.info('Clearing existing data...')
  await db.delete(student_progress)
  await db.delete(student_exercise_progress)
  await db.delete(notes)
  await db.delete(feedback)
  await db.delete(exercises)
  await db.delete(sections)
  await db.delete(chapters)
  await db.delete(courses)
  await db.delete(users)

  let chapterCount = 0
  let sectionCount = 0
  let exerciseCount = 0
  let authoredCount = 0

  for (const course of courseData.courses) {
    const courseKey = `course:${course.slug}`
    const courseId = seedUlid(courseKey)

    await db.insert(courses).values({
      id: courseId,
      title: course.title,
      description: course.description,
      slug: course.slug,
      subject_area: course.subject_area,
      level: course.level,
      tags: course.tags,
      price: course.price ?? null,
      purchase_active_length: course.purchase_active_length ?? null,
      ...dates(courseKey, -720, -365),
    })

    let chapterSort = 0
    for (const chapter of course.chapters) {
      chapterSort += 1
      chapterCount += 1
      const chapterKey = `${courseKey}:chapter:${chapterSort}`
      const chapterId = seedUlid(chapterKey)

      await db.insert(chapters).values({
        id: chapterId,
        course_id: courseId,
        title: chapter.title,
        description: chapter.description,
        // Display numbers are positional, so they are derived like sort_order
        // and IDs. The authored values disagreed between courses: some
        // numbered sections globally, others restarted each chapter.
        chapter_display_number: chapterSort,
        sort_order: chapterSort,
        estimated_time_minutes: chapter.estimated_time_minutes ?? parseEstimatedTime(chapter.estimated_time),
        ...dates(chapterKey, -364, -182),
      })

      let sectionSort = 0
      for (const section of chapter.sections) {
        sectionSort += 1
        sectionCount += 1
        const sectionKey = `${chapterKey}:section:${sectionSort}`
        const sectionId = seedUlid(sectionKey)
        const content = resolveContent(section.content, `${section.title} (${sectionKey})`)
        if (content !== null) authoredCount += 1

        await db.insert(sections).values({
          id: sectionId,
          course_id: courseId,
          chapter_id: chapterId,
          title: section.title,
          description: section.description,
          section_display_number: sectionSort,
          sort_order: sectionSort,
          content_type: section.content_type,
          content,
          access_level: section.access_level,
          ...dates(sectionKey, -181, -90),
        })

        const exercise = section.exercise
        if (!exercise) continue

        exerciseCount += 1
        const exerciseKey = `${sectionKey}:exercise:${exercise.exercise_display_number}`

        await db.insert(exercises).values({
          id: seedUlid(exerciseKey),
          section_id: sectionId,
          exercise_display_number: exercise.exercise_display_number,
          sort_order: exercise.exercise_display_number,
          instructions: exercise.instructions,
          browser_html: exercise.browser_html ?? {},
          code_files: exercise.code_files ?? {},
          tests: exercise.tests ?? {},
          hints: exercise.hints ?? {},
          difficulty: exercise.difficulty ?? DIFFICULTIES[exerciseCount % DIFFICULTIES.length]!,
          default_solution: exercise.default_solution ?? {},
          student_solution: exercise.student_solution ?? {},
          estimated_time_minutes: exercise.estimated_time_minutes || 15,
          ...dates(exerciseKey, -89, -30),
        })
      }
    }
  }

  console.info(
    `Seeded ${courseData.courses.length} courses, ${chapterCount} chapters, ` +
      `${sectionCount} sections, ${exerciseCount} exercises.`,
  )
  console.info(`${authoredCount} of ${sectionCount} sections have authored content; the rest are NULL.`)
}

// Run directly via `yarn db:seed`, but stay importable from tests.
const invokedDirectly = process.argv[1]?.endsWith('seed.ts') ?? false

if (invokedDirectly) {
  seedDb()
    .then(() => {
      client.close()
      console.info('Seed complete.')
    })
    .catch((error: unknown) => {
      console.error('Seed failed:', error)
      client.close()
      process.exitCode = 1
    })
}
