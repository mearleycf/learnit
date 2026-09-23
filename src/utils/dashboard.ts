import { db } from '@db/client'
import { chapters, courses, feedback, sections, student_progress } from '@db/schema'
import { isOpen } from '@schemas/feedback.schema'
import { desc, eq } from 'drizzle-orm'

import { percentComplete } from './progress'

export type CourseSummary = {
  slug: string
  title: string
  description: string
  level: string
  price: number | null
  totalSections: number
  authoredSections: number
  completedSections: number
  percent: number
  /** Where to pick up, or null when the student has not started. */
  resume: { chapter: number; section: number; title: string } | null
}

/**
 * Everything the dashboard needs about each course, in one pass.
 *
 * Reads the whole section and chapter tables rather than querying per course.
 * At this size that is one round trip instead of several, and the joins stay
 * simple enough to read.
 */
export const courseSummaries = async (userId: string | null): Promise<CourseSummary[]> => {
  const [courseRows, chapterRows, sectionRows, progressRows] = await Promise.all([
    db.select().from(courses).orderBy(courses.title),
    db.select().from(chapters),
    db.select().from(sections),
    userId ? db.select().from(student_progress).where(eq(student_progress.student_id, userId)) : [],
  ])

  const chapterNumber = new Map(chapterRows.map(row => [row.id, row.chapter_display_number]))
  const progressByCourse = new Map(progressRows.map(row => [row.course_id, row]))

  return courseRows.map(course => {
    const own = sectionRows.filter(section => section.course_id === course.id)
    const progress = progressByCourse.get(course.id)
    const completed = new Set(progress?.completed_sections ?? [])
    const completedHere = own.filter(section => completed.has(section.id)).length

    const current = own.find(section => section.id === progress?.current_section_id)
    const chapter = current ? chapterNumber.get(current.chapter_id) : undefined

    return {
      slug: course.slug,
      title: course.title,
      description: course.description,
      level: course.level,
      price: course.price,
      totalSections: own.length,
      authoredSections: own.filter(section => section.content !== null).length,
      completedSections: completedHere,
      percent: percentComplete(completedHere, own.length),
      resume:
        current && chapter !== undefined
          ? { chapter, section: current.section_display_number, title: current.title }
          : null,
    }
  })
}

/** Reports still waiting on someone, for the dashboard's attention line. */
export const openFeedbackCount = async (): Promise<number> => {
  const rows = await db.select({ status: feedback.status }).from(feedback).orderBy(desc(feedback.created_at))
  return rows.filter(row => isOpen(row.status)).length
}
