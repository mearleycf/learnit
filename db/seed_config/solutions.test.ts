import { resolve } from 'node:path'

import { installDomStub } from '@lib/exercise-runner/dom-stub'
import { prepare } from '@lib/exercise-runner/jsx'
import { linkModules } from '@lib/exercise-runner/link'
import { buildHarness, EXERCISE_DIR, filesToWrite, type HarnessResult } from '@lib/exercise-runner/python'
import { runTests } from '@lib/exercise-runner/run'
import type { TestCase } from '@lib/exercise-runner/types'
// @vitest-environment node
//
// Deliberately not jsdom. Checks run in a Worker with no DOM, where
// `installDomStub` supplies a stand-in. jsdom would provide a real document
// with none of the exercise's elements in it, so a DOM exercise would fail
// here for a reason it never fails in the app.
import { describe, expect, it } from 'vitest'

import { loadCourses } from '../content/load'
import type { ExerciseConfig } from './types/seed-types'

type CodeFile = { filename: string; content: string; language?: string }

/**
 * Every authored exercise, flattened, with the context to name it in a failure.
 *
 * Only exercises carrying real checks are included; the placeholder seeds have
 * empty payloads and nothing to assert.
 */
const courseConfigs = await loadCourses(resolve(process.cwd(), 'content'))

const authoredExercises = courseConfigs.flatMap(course =>
  course.chapters.flatMap((chapter, chapterIndex) =>
    chapter.sections.flatMap((section, sectionIndex) => {
      const exercise = section.exercise
      const tests = (exercise?.tests as { tests?: TestCase[] } | undefined)?.tests
      if (!exercise || !tests?.length) return []
      const first = (exercise.code_files as { files?: CodeFile[] } | undefined)?.files?.[0]
      return [
        {
          name: `${course.slug} ${chapterIndex + 1}.${sectionIndex + 1} — ${section.title}`,
          exercise: exercise as ExerciseConfig,
          tests,
          language: first?.language ?? 'javascript',
          react:
            (exercise.code_files as { files?: CodeFile[] } | undefined)?.files?.some(f =>
              /\.(jsx|tsx)$/.test(f.filename),
            ) ?? false,
        },
      ]
    }),
  ),
)

/** Node can import a module from a data URL, which stands in for the Worker's blob URLs. */
const dataUrl = (code: string) => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`

// Same stand-in document the Worker installs, so grading matches the app.
installDomStub(globalThis as unknown as Record<string, unknown>)

type Pyodide = {
  FS: { mkdirTree: (path: string) => void; writeFile: (path: string, data: string) => void }
  runPython: (code: string) => string
}

/** Pyodide is slow to start, so one runtime is shared across every Python check. */
let pyodide: Promise<Pyodide> | null = null
const getPyodide = async (): Promise<Pyodide> => {
  pyodide ??= import('pyodide').then(m => m.loadPyodide() as Promise<Pyodide>)
  return pyodide
}

/**
 * React bundles, as file URLs.
 *
 * The Worker serves these from `/react/`, which means nothing here; Node needs
 * a path it can import.
 */
const REACT_MODULES = {
  react: new URL('../../public/react/react.mjs', import.meta.url).href,
  'react-dom/server': new URL('../../public/react/react-dom-server.mjs', import.meta.url).href,
  'react-dom': new URL('../../public/react/react-dom-server.mjs', import.meta.url).href,
}

type ReactModule = { createElement: (type: unknown, props: unknown) => unknown }
type ServerModule = { renderToStaticMarkup: (element: unknown) => string }

/** The same `render` helper the Worker gives a React exercise's checks. */
const reactHelpers = async (): Promise<Record<string, unknown>> => {
  const [React, server] = (await Promise.all([
    import(/* @vite-ignore */ REACT_MODULES.react),
    import(/* @vite-ignore */ REACT_MODULES['react-dom/server']),
  ])) as [ReactModule, ServerModule]

  return {
    React,
    render: (Component: unknown, props: unknown = {}) =>
      server.renderToStaticMarkup(React.createElement(Component, props)),
  }
}

/** Runs a Python exercise the same way the Pyodide Worker does. */
const runPython = async (files: CodeFile[], entry: string, tests: TestCase[]) => {
  const py = await getPyodide()
  py.FS.mkdirTree(EXERCISE_DIR)
  for (const file of filesToWrite(files.map(f => ({ filename: f.filename, content: f.content })))) {
    py.FS.writeFile(file.path, file.content)
  }
  return JSON.parse(py.runPython(buildHarness(entry, tests))) as HarnessResult
}

describe('authored exercises', () => {
  it('finds the exercises to check', () => {
    expect(authoredExercises.length).toBeGreaterThanOrEqual(4)
  })

  for (const { name, exercise, tests, language, react } of authoredExercises) {
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

        if (language === 'python') {
          const result = await runPython(withSolution, entry, tests)
          expect(result.loadError).toBeNull()
          expect(result.outcomes.filter(o => !o.passed).map(o => `${o.name}: ${o.message}`)).toEqual([])
          return
        }

        const prepared = react
          ? withSolution.map(f => ({ ...f, content: prepare(f.filename, f.content, REACT_MODULES) }))
          : withSolution
        const helpers = react ? await reactHelpers() : {}

        const entryUrl = linkModules(prepared, entry, dataUrl)
        const module = (await import(/* @vite-ignore */ entryUrl)) as Record<string, unknown>
        const result = runTests({ ...helpers, ...module }, tests)

        const failures = result.outcomes.filter(outcome => !outcome.passed)
        expect(failures.map(f => `${f.name}: ${f.message}`)).toEqual([])
        expect(result.passed).toBe(result.total)
      })

      it('the starter does not already pass, so the exercise is worth doing', async () => {
        if (language === 'python') {
          const result = await runPython(files, entry, tests)
          const passed = result.outcomes.filter(o => o.passed).length
          expect(passed, 'the starter already passes every check').toBeLessThan(tests.length)
          return
        }

        const prepared = react
          ? files.map(f => ({ ...f, content: prepare(f.filename, f.content, REACT_MODULES) }))
          : files
        const helpers = react ? await reactHelpers() : {}

        const entryUrl = linkModules(prepared, entry, dataUrl)
        const module = (await import(/* @vite-ignore */ entryUrl)) as Record<string, unknown>
        const result = runTests({ ...helpers, ...module }, tests)

        expect(result.passed, 'the starter already passes every check').toBeLessThan(result.total)
      })
    })
  }
})
