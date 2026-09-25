import { resolve } from 'node:path'

import { loadCourses } from '../../db/content/load'
import { localNotes, localProgress } from '../../db/seed_config/seed/local-user'

/**
 * Where the suite finds things, without pinning a real section.
 *
 * Real courses are being written and renumbered, so a hard-coded
 * `/courses/javascript-fundamentals/1/6` breaks as soon as that section is
 * authored or moves. Tests use the fixture course the suite owns instead, and
 * anything that must come from a real course is read from `content/` and the
 * seed config, the same sources the seeder uses.
 */

/** The fixture course in `tests/fixtures/content`, seeded only into e2e.db. */
const FIXTURE = '/courses/e2e-fixtures'

export const fixture = {
  lesson: `${FIXTURE}/1/1`,
  /** Single file, seven checks, three hints, no preview markup. */
  exercise: `${FIXTURE}/1/2`,
  /** progress.js is the entry and imports from a read-only format.js. */
  multiFile: `${FIXTURE}/1/3`,
  recap: `${FIXTURE}/1/4`,
  /** Renders into a page, so it carries preview markup and four hints. */
  domExercise: `${FIXTURE}/2/1`,
  stubLesson: `${FIXTURE}/3/1`,
  stubExercise: `${FIXTURE}/3/2`,
  stubRecap: `${FIXTURE}/3/3`,
}

const sectionsOf = async (slug: string) => {
  const courses = await loadCourses(resolve(process.cwd(), 'content'))
  const course = courses.find(candidate => candidate.slug === slug)
  if (!course) throw new Error(`No course "${slug}" under content/`)
  return course.chapters.flatMap((chapter, c) =>
    chapter.sections.map((section, s) => ({ chapter: c + 1, section: s + 1, title: section.title })),
  )
}

/** Total sections and the seeded completions for a real course, as the outline counts them. */
export const courseProgress = async (slug: keyof typeof localProgress) => {
  const sections = await sectionsOf(slug)
  const { completed } = localProgress[slug]
  const isDone = (s: { chapter: number; section: number }) =>
    completed.some(done => done.chapter === s.chapter && done.section === s.section)
  const notDone = sections.find(s => !isDone(s))
  if (!notDone) throw new Error(`Every section of ${slug} is complete in the seed`)
  return {
    total: sections.length,
    completed: completed.length,
    /** A section the seed leaves incomplete, to mark and unmark. */
    incompletePath: `/courses/${slug}/${notDone.chapter}/${notDone.section}`,
  }
}

/** The first seeded note anchored to a passage, with where it lives and that section's title. */
export const anchoredNote = async () => {
  const note = localNotes.find(candidate => 'quote' in candidate && candidate.quote)
  if (!note || !('quote' in note) || !note.quote) throw new Error('The seed has no anchored note')
  const sections = await sectionsOf(note.course)
  const at = sections.find(s => s.chapter === note.chapter && s.section === note.section)
  if (!at) throw new Error(`Seeded note points at missing section ${note.chapter}.${note.section}`)
  return {
    ...note,
    quote: note.quote,
    path: `/courses/${note.course}/${note.chapter}/${note.section}`,
    title: at.title,
  }
}

export const seededNoteCount = localNotes.length
