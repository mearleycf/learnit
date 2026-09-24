import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { ChapterConfig, CourseConfig, ExerciseConfig, SectionConfig } from '../seed_config/types/seed-types'

import { ContentError, optionalNumber, optionalString, parseFrontmatter, requireString, splitSections } from './parse'

/**
 * Loads courses from `content/` on disk.
 *
 * Layout, where the numeric prefixes set the order and are stripped from names:
 *
 *   content/javascript-fundamentals/course.md
 *   content/javascript-fundamentals/01-language-fundamentals/chapter.md
 *   content/javascript-fundamentals/01-language-fundamentals/01-types.md
 *
 * Every section is one markdown file. Its `type` in frontmatter decides how the
 * body is read: prose for a lesson, a summary plus key points for a recap, and
 * headed code blocks for an exercise.
 */

const numbered = (names: string[]): string[] => names.filter(name => /^\d\d-/.test(name)).sort()

const readIfPresent = async (path: string): Promise<string | null> => {
  try {
    return await readFile(path, 'utf8')
  } catch {
    return null
  }
}

type ExerciseFile = { name: string; language?: string; readonly?: boolean; hidden?: boolean }

/** Builds an exercise from its frontmatter and the headed blocks in its body. */
const toExercise = (data: Record<string, unknown>, body: string, path: string): ExerciseConfig => {
  const { intro, blocks } = splitSections(body)
  const declared = (data.files ?? []) as ExerciseFile[]
  if (declared.length === 0) throw new ContentError(`${path}: exercise declares no files`)

  const block = (heading: string) => blocks.find(candidate => candidate.heading === heading)

  const files = declared.map(file => {
    const found = block(`file ${file.name}`)
    if (!found) throw new ContentError(`${path}: no "## file ${file.name}" block`)
    return {
      filename: file.name,
      language: file.language ?? 'javascript',
      content: found.code,
      isReadOnly: file.readonly ?? false,
      isHidden: file.hidden ?? false,
    }
  })

  const solution = block('solution')
  if (!solution) throw new ContentError(`${path}: no "## solution" block`)

  // Checks and hints are headed blocks, not frontmatter: the assertion is
  // JavaScript, which YAML mangles.
  const checks = blocks
    .filter(candidate => candidate.heading.startsWith('check '))
    .map(candidate => ({
      name: candidate.heading.slice('check '.length),
      description: candidate.prose,
      testFunction: candidate.code,
    }))
  if (checks.length === 0) throw new ContentError(`${path}: exercise has no "## check ..." blocks`)

  const hints = blocks
    .filter(candidate => /^hint after \d+$/.test(candidate.heading))
    .map((candidate, index) => ({
      order: index + 1,
      type: candidate.code ? ('code' as const) : ('text' as const),
      content: candidate.code || candidate.prose,
      showAfterAttempts: Number(/\d+/.exec(candidate.heading)?.[0] ?? index + 1),
    }))

  return {
    seedSequence: 1,
    exercise_display_number: optionalNumber(data, 'number') ?? 1,
    estimated_time_minutes: optionalNumber(data, 'minutes') ?? 20,
    difficulty: (optionalString(data, 'difficulty') ?? 'medium') as ExerciseConfig['difficulty'],
    instructions: intro,
    code_files: { files, defaultView: requireString(data, 'entry', path) },
    tests: { tests: checks.map(check => ({ ...check, expectedOutput: null })) },
    hints: { hints },
    default_solution: { content: solution.code, explanation: block('explanation')?.prose ?? '' },
  }
}

/** Splits a recap body into its summary paragraph and the key points beneath it. */
const toRecap = (body: string) => {
  const { intro, blocks } = splitSections(body)
  const points = blocks.find(block => block.heading.toLowerCase() === 'key points')
  return {
    summary: intro,
    key_points: (points?.prose ?? '')
      .split('\n')
      .map(line => line.replace(/^[-*]\s+/, '').trim())
      .filter(Boolean),
  }
}

const loadSection = async (dir: string, file: string, displayNumber: number): Promise<SectionConfig> => {
  const path = join(dir, file)
  const { data, body } = parseFrontmatter(await readFile(path, 'utf8'), path)
  const type = requireString(data, 'type', path)

  const base = {
    seedSequence: displayNumber,
    title: requireString(data, 'title', path),
    description: requireString(data, 'description', path),
    section_display_number: displayNumber,
    access_level: (optionalString(data, 'access') ?? 'purchased') as SectionConfig['access_level'],
  }

  if (type === 'lesson') {
    return { ...base, content_type: 'lesson', content: { content_type: 'lesson', lesson: { markdown: body } } }
  }
  if (type === 'recap') {
    return { ...base, content_type: 'recap', content: { content_type: 'recap', recap: toRecap(body) } }
  }
  if (type === 'exercise') {
    return {
      ...base,
      content_type: 'exercise',
      content: { content_type: 'exercise' },
      exercise: toExercise(data, body, path),
    }
  }
  throw new ContentError(`${path}: unknown type "${type}"`)
}

const loadChapter = async (dir: string, displayNumber: number): Promise<ChapterConfig> => {
  const path = join(dir, 'chapter.md')
  const source = await readIfPresent(path)
  if (source === null) throw new ContentError(`${dir}: no chapter.md`)

  const { data, body } = parseFrontmatter(source, path)
  const files = numbered(await readdir(dir)).filter(name => name.endsWith('.md'))

  return {
    seedSequence: displayNumber,
    title: requireString(data, 'title', path),
    description: body || requireString(data, 'description', path),
    chapter_display_number: displayNumber,
    estimated_time: optionalString(data, 'estimated_time'),
    sections: await Promise.all(files.map((file, index) => loadSection(dir, file, index + 1))),
  }
}

/** Loads one course directory into the shape the seeder already understands. */
export const loadCourse = async (dir: string): Promise<CourseConfig> => {
  const path = join(dir, 'course.md')
  const source = await readIfPresent(path)
  if (source === null) throw new ContentError(`${dir}: no course.md`)

  const { data, body } = parseFrontmatter(source, path)
  const chapters = numbered(
    await readdir(dir, { withFileTypes: true }).then(e => e.filter(x => x.isDirectory()).map(x => x.name)),
  )

  return {
    seedSequence: 1,
    title: requireString(data, 'title', path),
    description: body || requireString(data, 'description', path),
    slug: requireString(data, 'slug', path),
    subject_area: requireString(data, 'subject_area', path),
    level: (optionalString(data, 'level') ?? 'beginner') as CourseConfig['level'],
    tags: (data.tags ?? []) as string[],
    price: optionalNumber(data, 'price') ?? null,
    purchase_active_length: optionalNumber(data, 'purchase_active_length') ?? null,
    chapters: await Promise.all(chapters.map((name, index) => loadChapter(join(dir, name), index + 1))),
  }
}

/** Loads every course under `content/`, in directory order. */
export const loadCourses = async (root: string): Promise<CourseConfig[]> => {
  const entries = await readdir(root, { withFileTypes: true })
  const dirs = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort()
  return Promise.all(dirs.map(name => loadCourse(join(root, name))))
}
