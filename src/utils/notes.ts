import { db } from '@db/client'
import { chapters, courses, notes, sections } from '@db/schema'
import { noteBodySchema, noteHighlightSchema } from '@schemas/notes.schema'
import { and, desc, eq } from 'drizzle-orm'
import { ulid } from 'ulidx'

export type NoteRow = typeof notes.$inferSelect

export type Note = {
  id: string
  markdown: string
  quote: string | null
  created_at: Date
}

/**
 * Parses a stored row into the shape pages render.
 *
 * A row whose body fails validation is dropped rather than thrown, so one bad
 * note cannot take out the section page.
 */
const toNote = (row: NoteRow): Note | null => {
  const body = noteBodySchema.safeParse(row.note_text)
  if (!body.success) return null

  const highlight = noteHighlightSchema.safeParse(row.highlighted_text)
  return {
    id: row.id,
    markdown: body.data.markdown,
    quote: highlight.success ? highlight.data.quote : null,
    created_at: row.created_at,
  }
}

export const listNotes = async (userId: string, sectionId: string): Promise<Note[]> => {
  const rows = await db
    .select()
    .from(notes)
    .where(and(eq(notes.student_id, userId), eq(notes.section_id, sectionId)))
    .orderBy(desc(notes.created_at))
  return rows.map(toNote).filter((note): note is Note => note !== null)
}

/**
 * Creates a note.
 *
 * Uses a real ULID rather than the seed helper: notes written at runtime are
 * user data, so randomness is correct here. Determinism is a seeding concern.
 */
export const createNote = async (
  userId: string,
  sectionId: string,
  markdown: string,
  quote?: string,
): Promise<void> => {
  await db.insert(notes).values({
    id: ulid(),
    student_id: userId,
    section_id: sectionId,
    note_text: { markdown },
    highlighted_text: quote ? { quote } : null,
  })
}

/** Updates a note's text, scoped to its owner so an ID alone is not enough. */
export const updateNote = async (userId: string, noteId: string, markdown: string): Promise<void> => {
  await db
    .update(notes)
    .set({ note_text: { markdown } })
    .where(and(eq(notes.id, noteId), eq(notes.student_id, userId)))
}

/** Deletes a note, scoped to its owner so an ID alone is not enough. */
export const deleteNote = async (userId: string, noteId: string): Promise<void> => {
  await db.delete(notes).where(and(eq(notes.id, noteId), eq(notes.student_id, userId)))
}

export type NoteWithContext = Note & {
  section: { id: string; title: string; display: number }
  chapterDisplay: number
  course: { slug: string; title: string }
}

/**
 * Every note the student has taken, newest first, with enough context to link
 * back to the section it belongs to.
 */
export const listAllNotes = async (userId: string): Promise<NoteWithContext[]> => {
  const rows = await db
    .select({ note: notes, section: sections, chapter: chapters, course: courses })
    .from(notes)
    .innerJoin(sections, eq(notes.section_id, sections.id))
    .innerJoin(chapters, eq(sections.chapter_id, chapters.id))
    .innerJoin(courses, eq(sections.course_id, courses.id))
    .where(eq(notes.student_id, userId))
    .orderBy(desc(notes.created_at))

  return rows.flatMap(({ note, section, chapter, course }) => {
    const parsed = toNote(note)
    if (!parsed) return []
    return [
      {
        ...parsed,
        section: { id: section.id, title: section.title, display: section.section_display_number },
        chapterDisplay: chapter.chapter_display_number,
        course: { slug: course.slug, title: course.title },
      },
    ]
  })
}
