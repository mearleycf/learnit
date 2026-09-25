import { resolve } from 'node:path'

import { sectionContentSchema } from '@schemas/sections.schema'

import { client, db } from './client'
import { loadCourses } from './content/load'
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
import { seedDate, seedUlid } from './seed_config/seed/deterministic'
import { localFeedback, localNotes, localProgress, localUser } from './seed_config/seed/local-user'
import type { ExerciseDifficulty } from './seed_config/types/seed-types'

const DIFFICULTIES: ExerciseDifficulty[] = ['easy', 'medium', 'hard']

/**
 * Where authored content lives.
 *
 * Resolved from the working directory rather than this module's URL: under
 * Vitest the module is served over http, and `fileURLToPath` rejects it.
 */
const CONTENT_ROOT = resolve(process.cwd(), 'content')

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

type SeedIndexes = {
  sectionIndex: Map<string, string>
  exerciseBySection: Map<string, string>
  courseIdBySlug: Map<string, string>
}

/**
 * Seeds the single local user and their progress.
 *
 * learnit runs locally for one person, so there is no auth. This user stands
 * in for the signed-in student. Progress is authored as chapter and section
 * numbers and resolved to IDs here.
 */
const seedLocalUser = async ({ sectionIndex, exerciseBySection, courseIdBySlug }: SeedIndexes): Promise<void> => {
  const userId = seedUlid('user:local')

  await db.insert(users).values({
    id: userId,
    ...localUser,
    enrolled_courses: Object.keys(localProgress)
      .map(slug => courseIdBySlug.get(slug))
      .filter((id): id is string => id !== undefined),
    last_sign_in: seedDate('user:local:signin', -3, 0),
    ...dates('user:local', -400, -380),
  })

  let feedbackCount = 0
  for (const report of localFeedback) {
    const sectionId = sectionIndex.get(`${report.course}:${report.chapter}:${report.section}`)
    if (!sectionId) {
      throw new Error(`Feedback references missing section ${report.course} ${report.chapter}.${report.section}`)
    }

    feedbackCount += 1
    const key = `feedback:${report.course}:${report.chapter}:${report.section}:${feedbackCount}`
    await db.insert(feedback).values({
      id: seedUlid(key),
      student_id: userId,
      section_id: sectionId,
      assigned_to_id: report.assigned ? userId : null,
      feedback_text: { markdown: report.markdown },
      rating: report.rating ?? null,
      status: report.status,
      category: report.category,
      admin_notes: report.adminNotes ?? null,
      github_issue_link: report.github ?? null,
      ...dates(key, -45, -1),
    })
  }

  let noteCount = 0
  for (const note of localNotes) {
    const sectionId = sectionIndex.get(`${note.course}:${note.chapter}:${note.section}`)
    if (!sectionId) throw new Error(`Note references missing section ${note.course} ${note.chapter}.${note.section}`)

    noteCount += 1
    const noteKey = `note:${note.course}:${note.chapter}:${note.section}:${noteCount}`
    await db.insert(notes).values({
      id: seedUlid(noteKey),
      student_id: userId,
      section_id: sectionId,
      note_text: { markdown: note.markdown },
      highlighted_text: note.quote ? { quote: note.quote } : null,
      ...dates(noteKey, -60, -2),
    })
  }

  for (const [slug, progress] of Object.entries(localProgress)) {
    const courseId = courseIdBySlug.get(slug)
    if (!courseId) throw new Error(`Progress references unknown course: ${slug}`)

    const resolve = (chapter: number, section: number) => {
      const id = sectionIndex.get(`${slug}:${chapter}:${section}`)
      if (!id) throw new Error(`Progress references missing section ${slug} ${chapter}.${section}`)
      return id
    }

    await db.insert(student_progress).values({
      id: seedUlid(`progress:${slug}`),
      student_id: userId,
      course_id: courseId,
      current_section_id: resolve(progress.current.chapter, progress.current.section),
      completed_sections: progress.completed.map(position => resolve(position.chapter, position.section)),
      enrollment_date: seedDate(`progress:${slug}:enrolled`, -120, -90),
      last_accessed_at: seedDate(`progress:${slug}:accessed`, -7, 0),
      ...dates(`progress:${slug}`, -120, -90),
    })

    for (const attempt of progress.exercises) {
      const sectionId = resolve(attempt.chapter, attempt.section)
      const exerciseId = exerciseBySection.get(sectionId)
      if (!exerciseId) throw new Error(`No exercise on ${slug} ${attempt.chapter}.${attempt.section}`)

      await db.insert(student_exercise_progress).values({
        id: seedUlid(`exercise-progress:${slug}:${attempt.chapter}:${attempt.section}`),
        student_id: userId,
        exercise_id: exerciseId,
        score: attempt.score,
        completed: attempt.completed,
        attempts: attempt.attempts,
        last_attempt_at: seedDate(`exercise-progress:${slug}:${attempt.chapter}:${attempt.section}`, -14, -1),
        ...dates(`exercise-progress:${slug}:${attempt.chapter}:${attempt.section}`, -30, -14),
      })
    }
  }
}

/**
 * Wipes every table and reinserts the authored course data.
 *
 * Deletes run child-first so foreign keys stay satisfied. Chapter, section and
 * exercise rows derive their parent ids and sort order here rather than in the
 * seed files.
 */
export const seedDb = async (): Promise<void> => {
  const courseConfigs = await loadCourses(CONTENT_ROOT)

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
  let writtenExercises = 0

  /** `${courseSlug}:${chapterNumber}:${sectionNumber}` -> section id. */
  const sectionIndex = new Map<string, string>()
  /** section id -> exercise id, for the progress rows below. */
  const exerciseBySection = new Map<string, string>()
  const courseIdBySlug = new Map<string, string>()

  for (const course of courseConfigs) {
    const courseKey = `course:${course.slug}`
    const courseId = seedUlid(courseKey)
    courseIdBySlug.set(course.slug, courseId)

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
        sectionIndex.set(`${course.slug}:${chapterSort}:${sectionSort}`, sectionId)

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
        // A placeholder carries instructions but no starter file and no checks.
        const checks = (exercise.tests as { tests?: unknown[] } | undefined)?.tests ?? []
        const starters = (exercise.code_files as { files?: unknown[] } | undefined)?.files ?? []
        if (checks.length > 0 && starters.length > 0) writtenExercises += 1

        const exerciseKey = `${sectionKey}:exercise:${exercise.exercise_display_number}`
        exerciseBySection.set(sectionId, seedUlid(exerciseKey))

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
          estimated_time_minutes: exercise.estimated_time_minutes || 15,
          ...dates(exerciseKey, -89, -30),
        })
      }
    }
  }

  await seedLocalUser({ sectionIndex, exerciseBySection, courseIdBySlug })

  console.info(
    `Seeded ${courseConfigs.length} courses, ${chapterCount} chapters, ` +
      `${sectionCount} sections, ${exerciseCount} exercises.`,
  )
  console.info(`${authoredCount} of ${sectionCount} sections have authored content; the rest are NULL.`)
  console.info(`${writtenExercises} of ${exerciseCount} exercises have a starter and checks.`)
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
