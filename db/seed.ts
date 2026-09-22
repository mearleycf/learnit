import { randomDateGenerator } from '@utils/general_utils'

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
import { courseDateOptions } from './seed_config/seed/date-options'
import type { ExerciseDifficulty } from './seed_config/types/seed-types'

const DIFFICULTIES: ExerciseDifficulty[] = ['easy', 'medium', 'hard']

/** Parses a human-authored duration such as "3 hours" or "45 minutes" into minutes. */
const parseEstimatedTime = (value: string | undefined, fallback = 60): number => {
  if (!value) return fallback
  const match = /(\d+(?:\.\d+)?)\s*(hour|hr|minute|min)/i.exec(value)
  if (!match?.[1] || !match[2]) return fallback
  const amount = Number(match[1])
  return /^h/i.test(match[2]) ? Math.round(amount * 60) : Math.round(amount)
}

const dates = (options: Parameters<typeof randomDateGenerator>[0]) => {
  const { createdDate, updatedDate } = randomDateGenerator(options)
  return { created_at: createdDate, updated_at: updatedDate ?? createdDate }
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

  for (const course of courseData.courses) {
    await db.insert(courses).values({
      id: course.id,
      title: course.title,
      description: course.description,
      slug: course.slug,
      subject_area: course.subject_area,
      level: course.level,
      tags: course.tags,
      price: course.price ?? null,
      purchase_active_length: course.purchase_active_length ?? null,
      ...dates(course.dateConfig ?? courseDateOptions.courses),
    })

    let chapterSort = 0
    for (const chapter of course.chapters) {
      chapterSort += 1
      chapterCount += 1
      await db.insert(chapters).values({
        id: chapter.id,
        course_id: course.id,
        title: chapter.title,
        description: chapter.description,
        chapter_display_number: chapter.chapter_display_number,
        sort_order: chapterSort,
        estimated_time_minutes: chapter.estimated_time_minutes ?? parseEstimatedTime(chapter.estimated_time),
        ...dates(chapter.dateConfig ?? courseDateOptions.chapters),
      })

      let sectionSort = 0
      for (const section of chapter.sections) {
        sectionSort += 1
        sectionCount += 1
        await db.insert(sections).values({
          id: section.id,
          course_id: course.id,
          chapter_id: chapter.id,
          title: section.title,
          description: section.description,
          section_display_number: section.section_display_number,
          sort_order: sectionSort,
          content_type: section.content_type,
          content: section.content ?? null,
          access_level: section.access_level,
          ...dates(section.dateConfig ?? courseDateOptions.sections),
        })

        const exercise = section.exercise
        if (!exercise) continue

        exerciseCount += 1
        await db.insert(exercises).values({
          id: exercise.id,
          section_id: section.id,
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
          ...dates(exercise.dateConfig ?? courseDateOptions.exercises),
        })
      }
    }
  }

  console.info(
    `Seeded ${courseData.courses.length} courses, ${chapterCount} chapters, ` +
      `${sectionCount} sections, ${exerciseCount} exercises.`,
  )
}

// Run directly via `yarn db:seed`.
seedDb()
  .then(async () => {
    client.close()
    console.info('Seed complete.')
  })
  .catch(async (error: unknown) => {
    console.error('Seed failed:', error)
    client.close()
    process.exitCode = 1
  })
