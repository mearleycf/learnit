import { db } from '@db/client'
import { courses, feedback, sections } from '@db/schema'
import { type FEEDBACK_CATEGORIES, type FEEDBACK_STATUSES, feedbackBodySchema, isOpen } from '@schemas/feedback.schema'
import { desc, eq } from 'drizzle-orm'
import { ulid } from 'ulidx'

export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number]
export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number]

export type FeedbackItem = {
  id: string
  markdown: string
  status: FeedbackStatus
  category: FeedbackCategory | null
  rating: number | null
  admin_notes: string | null
  github_issue_link: string | null
  created_at: Date
  section: { id: string; title: string; display: number }
  chapterDisplay: number | null
  course: { slug: string; title: string } | null
}

/**
 * Loads every report, newest first, with enough context to link back.
 *
 * A row whose body fails validation is dropped rather than thrown, so one bad
 * record cannot take out the triage page.
 */
export const listFeedback = async (): Promise<FeedbackItem[]> => {
  const rows = await db
    .select({
      item: feedback,
      section: sections,
      course: courses,
    })
    .from(feedback)
    .leftJoin(sections, eq(feedback.section_id, sections.id))
    .leftJoin(courses, eq(sections.course_id, courses.id))
    .orderBy(desc(feedback.created_at))

  const chapterNumbers = await db.select().from(sections)
  const chapterBySection = new Map(chapterNumbers.map(row => [row.id, row.chapter_id]))
  const chapters = await db.query.chapters.findMany()
  const chapterDisplayById = new Map(chapters.map(row => [row.id, row.chapter_display_number]))

  return rows.flatMap(({ item, section, course }) => {
    const body = feedbackBodySchema.safeParse(item.feedback_text)
    if (!body.success || !section) return []

    const chapterId = chapterBySection.get(section.id)
    return [
      {
        id: item.id,
        markdown: body.data.markdown,
        status: item.status as FeedbackStatus,
        category: (item.category ?? null) as FeedbackCategory | null,
        rating: item.rating,
        admin_notes: item.admin_notes,
        github_issue_link: item.github_issue_link,
        created_at: item.created_at,
        section: { id: section.id, title: section.title, display: section.section_display_number },
        chapterDisplay: chapterId ? (chapterDisplayById.get(chapterId) ?? null) : null,
        course: course ? { slug: course.slug, title: course.title } : null,
      },
    ]
  })
}

export const countOpen = (items: FeedbackItem[]): number => items.filter(item => isOpen(item.status)).length

export const createFeedback = async (
  userId: string,
  sectionId: string,
  markdown: string,
  category: FeedbackCategory,
  rating?: number,
): Promise<void> => {
  await db.insert(feedback).values({
    id: ulid(),
    student_id: userId,
    section_id: sectionId,
    feedback_text: { markdown },
    category,
    rating: rating ?? null,
    status: 'submitted',
  })
}

export const setFeedbackStatus = async (id: string, status: FeedbackStatus): Promise<void> => {
  await db.update(feedback).set({ status }).where(eq(feedback.id, id))
}
