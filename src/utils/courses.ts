import { db } from '@db/client'
import { chapters, courses, exercises, sections } from '@db/schema'
import { sectionContentSchema } from '@schemas/sections.schema'
import { asc, eq } from 'drizzle-orm'

export type CourseRow = typeof courses.$inferSelect
export type ChapterRow = typeof chapters.$inferSelect
export type SectionRow = typeof sections.$inferSelect
export type ExerciseRow = typeof exercises.$inferSelect

/** A chapter with its sections, ordered for display. */
export type ChapterOutline = ChapterRow & { sections: SectionRow[] }

export const listCourses = async (): Promise<CourseRow[]> => db.select().from(courses).orderBy(asc(courses.title))

export const getCourseBySlug = async (slug: string): Promise<CourseRow | null> => {
  const [course] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1)
  return course ?? null
}

/** Returns the course's chapters, each carrying its own ordered sections. */
export const getCourseOutline = async (courseId: string): Promise<ChapterOutline[]> => {
  const [chapterRows, sectionRows] = await Promise.all([
    db.select().from(chapters).where(eq(chapters.course_id, courseId)).orderBy(asc(chapters.sort_order)),
    db.select().from(sections).where(eq(sections.course_id, courseId)).orderBy(asc(sections.sort_order)),
  ])

  return chapterRows.map(chapter => ({
    ...chapter,
    sections: sectionRows.filter(section => section.chapter_id === chapter.id),
  }))
}

/** A section together with the chapter it belongs to, for building URLs. */
export type PositionedSection = SectionRow & { chapter_display_number: number }

/**
 * Resolves a section from its chapter and section numbers.
 *
 * Section numbers restart within each chapter, so both are required to
 * identify one unambiguously.
 */
export const getSection = async (
  courseId: string,
  chapterNumber: number,
  sectionNumber: number,
): Promise<SectionRow | null> => {
  const outline = await getCourseOutline(courseId)
  const chapter = outline.find(row => row.chapter_display_number === chapterNumber)
  return chapter?.sections.find(row => row.section_display_number === sectionNumber) ?? null
}

export const getExerciseForSection = async (sectionId: string): Promise<ExerciseRow | null> => {
  const [exercise] = await db.select().from(exercises).where(eq(exercises.section_id, sectionId)).limit(1)
  return exercise ?? null
}

/**
 * Parses a section's stored content.
 *
 * Returns null both when nothing has been authored and when the stored value
 * fails validation, so a bad row degrades to an empty state instead of
 * breaking the page.
 */
export const parseSectionContent = (raw: unknown) => {
  if (raw == null) return null
  const parsed = sectionContentSchema.safeParse(raw)
  return parsed.success ? parsed.data : null
}

/** Flattens an outline into the ordered list used for previous/next links. */
export const flattenSections = (outline: ChapterOutline[]): PositionedSection[] =>
  outline.flatMap(chapter =>
    chapter.sections.map(section => ({ ...section, chapter_display_number: chapter.chapter_display_number })),
  )

/** Canonical URL for a section. */
export const sectionHref = (courseSlug: string, section: PositionedSection): string =>
  `/courses/${courseSlug}/${section.chapter_display_number}/${section.section_display_number}`
