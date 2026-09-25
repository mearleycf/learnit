import { db } from '@db/client'
import { chapters, courses, notes, sections } from '@db/schema'
import { noteBodySchema } from '@schemas/notes.schema'
import { sectionContentSchema } from '@schemas/sections.schema'
import { eq } from 'drizzle-orm'

export type SearchHit = {
  kind: 'course' | 'section' | 'note'
  title: string
  /** Surrounding text with the match in it, for context. */
  snippet: string
  href: string
  context: string
}

/** Longest snippet shown, and how much text to keep either side of a match. */
const SNIPPET_PAD = 70

/**
 * Pulls the text around the first match.
 *
 * Returns the head of the text when the term is not in this field, which
 * happens when a record matched on its title instead.
 */
export const snippetAround = (text: string, term: string): string => {
  const flat = text.replace(/\s+/g, ' ').trim()
  const at = flat.toLowerCase().indexOf(term.toLowerCase())
  if (at === -1) return flat.length > SNIPPET_PAD * 2 ? `${flat.slice(0, SNIPPET_PAD * 2)}…` : flat

  const start = Math.max(0, at - SNIPPET_PAD)
  const end = Math.min(flat.length, at + term.length + SNIPPET_PAD)
  return `${start > 0 ? '…' : ''}${flat.slice(start, end)}${end < flat.length ? '…' : ''}`
}

/** Plain text of a section's content, for searching and snippets. */
export const contentText = (raw: unknown): string => {
  const parsed = sectionContentSchema.safeParse(raw)
  if (!parsed.success) return ''
  if (parsed.data.content_type === 'lesson') return parsed.data.lesson?.markdown ?? ''
  if (parsed.data.content_type === 'recap') {
    const recap = parsed.data.recap
    return recap ? [recap.summary, ...recap.key_points].join(' ') : ''
  }
  return ''
}

const matches = (haystack: string, term: string) => haystack.toLowerCase().includes(term.toLowerCase())

/**
 * Searches course titles, section text and the student's notes.
 *
 * Case-insensitive substring matching done in memory. At this size that is
 * simpler than full-text indexing and fast enough; revisit if the content
 * grows by an order of magnitude.
 */
export const search = async (term: string, userId: string | null): Promise<SearchHit[]> => {
  const trimmed = term.trim()
  if (trimmed.length < 2) return []

  const [courseRows, chapterRows, sectionRows, noteRows] = await Promise.all([
    db.select().from(courses),
    db.select().from(chapters),
    db.select().from(sections),
    userId ? db.select().from(notes).where(eq(notes.student_id, userId)) : [],
  ])

  const courseById = new Map(courseRows.map(row => [row.id, row]))
  const chapterNumber = new Map(chapterRows.map(row => [row.id, row.chapter_display_number]))
  const sectionById = new Map(sectionRows.map(row => [row.id, row]))

  const sectionHref = (section: (typeof sectionRows)[number]) => {
    const course = courseById.get(section.course_id)
    const chapter = chapterNumber.get(section.chapter_id)
    if (!course || chapter === undefined) return null
    return `/courses/${course.slug}/${chapter}/${section.section_display_number}`
  }

  const hits: SearchHit[] = []

  for (const course of courseRows) {
    if (matches(course.title, trimmed) || matches(course.description, trimmed)) {
      hits.push({
        kind: 'course',
        title: course.title,
        snippet: snippetAround(course.description, trimmed),
        href: `/courses/${course.slug}`,
        context: 'Course',
      })
    }
  }

  for (const section of sectionRows) {
    const body = contentText(section.content)
    if (!matches(section.title, trimmed) && !matches(section.description, trimmed) && !matches(body, trimmed)) continue

    const href = sectionHref(section)
    const course = courseById.get(section.course_id)
    if (!href || !course) continue

    hits.push({
      kind: 'section',
      title: section.title,
      snippet: snippetAround(body || section.description, trimmed),
      href,
      context: `${course.title} · ${section.content_type}`,
    })
  }

  for (const note of noteRows) {
    const body = noteBodySchema.safeParse(note.note_text)
    if (!body.success || !matches(body.data.markdown, trimmed)) continue

    const section = sectionById.get(note.section_id)
    const href = section ? sectionHref(section) : null
    hits.push({
      kind: 'note',
      title: section?.title ?? 'Note',
      snippet: snippetAround(body.data.markdown, trimmed),
      href: href ?? '/notes',
      context: 'Your note',
    })
  }

  return hits
}
