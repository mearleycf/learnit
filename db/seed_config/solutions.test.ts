import { installDomStub } from '@lib/exercise-runner/dom-stub'
import { linkModules } from '@lib/exercise-runner/link'
import { runTests } from '@lib/exercise-runner/run'
import type { TestCase } from '@lib/exercise-runner/types'
// @vitest-environment node
//
// Deliberately not jsdom. Checks run in a Worker with no DOM, where
// `installDomStub` supplies a stand-in. jsdom would provide a real document
// with none of the exercise's elements in it, so a DOM exercise would fail
// here for a reason it never fails in the app.
import { describe, expect, it } from 'vitest'

import { courseData } from './seed/courses/index'
import type { ExerciseConfig } from './types/seed-types'

type CodeFile = { filename: string; content: string }

/**
 * Every authored exercise, flattened, with the context to name it in a failure.
 *
 * Only exercises carrying real checks are included; the placeholder seeds have
 * empty payloads and nothing to assert.
 */
const authoredExercises = courseData.courses.flatMap(course =>
  course.chapters.flatMap((chapter, chapterIndex) =>
    chapter.sections.flatMap((section, sectionIndex) => {
      const exercise = section.exercise
      const tests = (exercise?.tests as { tests?: TestCase[] } | undefined)?.tests
      if (!exercise || !tests?.length) return []
      return [
        {
          name: `${course.slug} ${chapterIndex + 1}.${sectionIndex + 1} — ${section.title}`,
          exercise: exercise as ExerciseConfig,
          tests,
        },
      ]
    }),
  ),
)

/** Node can import a module from a data URL, which stands in for the Worker's blob URLs. */
const dataUrl = (code: string) => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`

// Same stand-in document the Worker installs, so grading matches the app.
installDomStub(globalThis as unknown as Record<string, unknown>)

describe('authored exercises', () => {
  it('finds the exercises to check', () => {
    expect(authoredExercises.length).toBeGreaterThanOrEqual(4)
  })

  for (const { name, exercise, tests } of authoredExercises) {
    describe(name, () => {
      const files = ((exercise.code_files as { files?: CodeFile[] }).files ?? []).map(file => ({
        filename: file.filename,
        content: String(file.content),
      }))
      const entry = (exercise.code_files as { defaultView?: string }).defaultView ?? files[0]?.filename ?? ''
      const solution = String((exercise.default_solution as { content?: unknown }).content ?? '')

      it('ships a worked solution and a starter for every check', () => {
        expect(solution.trim(), 'no worked solution').not.toBe('')
        expect(files.length, 'no code files').toBeGreaterThan(0)
        expect(entry, 'no entry file').not.toBe('')
      })

      it('the worked solution passes every check', async () => {
        // Swap the starter for the solution, keeping read-only helpers as they are.
        const withSolution = files.map(file => (file.filename === entry ? { ...file, content: solution } : file))

        const entryUrl = linkModules(withSolution, entry, dataUrl)
        const module = (await import(/* @vite-ignore */ entryUrl)) as Record<string, unknown>
        const result = runTests({ ...module }, tests)

        const failures = result.outcomes.filter(outcome => !outcome.passed)
        expect(failures.map(f => `${f.name}: ${f.message}`)).toEqual([])
        expect(result.passed).toBe(result.total)
      })

      it('the starter does not already pass, so the exercise is worth doing', async () => {
        const entryUrl = linkModules(files, entry, dataUrl)
        const module = (await import(/* @vite-ignore */ entryUrl)) as Record<string, unknown>
        const result = runTests({ ...module }, tests)

        expect(result.passed, 'the starter already passes every check').toBeLessThan(result.total)
      })
    })
  }
})
