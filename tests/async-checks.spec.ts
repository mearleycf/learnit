import { expect, type Page, test } from '@playwright/test'

import type { SourceFile } from '../src/lib/exercise-runner/link'
import type { RunResult, TestCase } from '../src/lib/exercise-runner/types'

/**
 * Async checks, run through the real Worker.
 *
 * No authored exercise needs an async check yet, so these hand `runExercise`
 * a fixture directly. The dev server serves source modules, so the page can
 * import the client and the Worker it spawns is the one the workspace uses.
 */
const run = async (
  page: Page,
  files: SourceFile[],
  entry: string,
  tests: TestCase[],
  language = 'javascript',
): Promise<RunResult> => {
  const attempt = () =>
    page.evaluate(
      async ({ files, entry, tests, language, clientPath }) => {
        const client = (await import(/* @vite-ignore */ clientPath)) as {
          runExercise: (...args: unknown[]) => Promise<RunResult>
        }
        return client.runExercise(files, entry, tests, language)
      },
      { files, entry, tests, language, clientPath: '/src/lib/exercise-runner/client.ts' },
    )

  try {
    return await attempt()
  } catch (error) {
    // On a cold cache Vite optimises the Worker's deps on first import and
    // reloads the page, which destroys the context. One retry covers it.
    if (!String(error).includes('Execution context was destroyed')) throw error
    await page.waitForLoadState('load')
    return attempt()
  }
}

const check = (name: string, testFunction: string): TestCase => ({ name, description: name, testFunction })

const JS = `
export const later = (value, ms = 20) => new Promise(resolve => setTimeout(() => resolve(value), ms))
export const fail = async message => { throw new Error(message) }
export const never = () => new Promise(() => {})
`

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('a JavaScript check can await, and a rejection fails it with its message', async ({ page }) => {
  const result = await run(page, [{ filename: 'index.js', content: JS }], 'index.js', [
    check('awaits', "assert.strictEqual(await later('x'), 'x')"),
    check('rejects', "await fail('no network')"),
    check('sync', 'assert.strictEqual(1, 1)'),
  ])

  expect(result.loadError).toBeNull()
  expect(result.outcomes.map(o => [o.passed, o.message])).toEqual([
    [true, null],
    [false, 'Error: no network'],
    [true, null],
  ])
})

test('a check that never settles fails on its own, and the run still reports', async ({ page }) => {
  const result = await run(page, [{ filename: 'index.js', content: JS }], 'index.js', [
    check('hangs', 'await never()'),
    check('after', "assert.strictEqual(await later('y'), 'y')"),
  ])

  expect(result.loadError).toBeNull()
  expect(result.outcomes[0]?.passed).toBe(false)
  expect(result.outcomes[0]?.message).toMatch(/^Timed out after 2 seconds\./)
  expect(result.outcomes[1]?.passed).toBe(true)
})

test('three checks that never settle each report their own timeout, not a run timeout', async ({ page }) => {
  const result = await run(page, [{ filename: 'index.js', content: JS }], 'index.js', [
    check('hangs 1', 'await never()'),
    check('hangs 2', 'await never()'),
    check('hangs 3', 'await never()'),
  ])

  expect(result.loadError).toBeNull()
  expect(result.outcomes.map(o => o.passed)).toEqual([false, false, false])
  for (const outcome of result.outcomes) expect(outcome.message).toMatch(/^Timed out after 2 seconds\./)
})

test('console output after an await belongs to the check that logged it', async ({ page }) => {
  const result = await run(page, [{ filename: 'index.js', content: JS }], 'index.js', [
    check('first', "console.log('a1'); await later(null); console.log('a2')"),
    check('second', "console.log('b')"),
  ])

  expect(result.logs.map(entry => [entry.checkIndex, entry.text])).toEqual([
    [0, 'a1'],
    [0, 'a2'],
    [1, 'b'],
  ])
})

test('a Python check can await', async ({ page }) => {
  test.setTimeout(90_000)
  const source = 'import asyncio\n\nasync def later(value):\n    await asyncio.sleep(0.01)\n    return value\n'

  const result = await run(
    page,
    [{ filename: 'solution.py', content: source }],
    'solution.py',
    [check('awaits', 'assert (await later(3)) == 3'), check('late', 'assert (await later(3)) == 4, "wrong"')],
    'python',
  )

  expect(result.loadError).toBeNull()
  expect(result.outcomes.map(o => [o.passed, o.message])).toEqual([
    [true, null],
    [false, 'wrong'],
  ])
})
