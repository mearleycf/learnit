// @vitest-environment node
//
// Runs the harness in a real Pyodide, the way the Worker does. Node rather than
// jsdom, because Pyodide picks its loader by sniffing the environment.
import { describe, expect, it } from 'vitest'

import { buildHarness, EXERCISE_DIR, type HarnessResult } from './python'
import type { TestCase } from './types'

type Pyodide = {
  FS: { mkdirTree: (path: string) => void; writeFile: (path: string, data: string) => void }
  runPythonAsync: (code: string) => Promise<string>
}

let pyodide: Promise<Pyodide> | null = null
const getPyodide = async (): Promise<Pyodide> => {
  pyodide ??= import('pyodide').then(m => m.loadPyodide() as Promise<Pyodide>)
  return pyodide
}

const SOURCE = `
import asyncio

async def later(value):
    await asyncio.sleep(0.01)
    return value

async def fail(message):
    raise ValueError(message)

async def never():
    await asyncio.Future()

def double(n):
    return n * 2
`

const check = (name: string, testFunction: string, timeout?: number): TestCase => ({
  name,
  description: '',
  testFunction,
  ...(timeout === undefined ? {} : { timeout }),
})

const run = async (tests: TestCase[]): Promise<HarnessResult> => {
  const py = await getPyodide()
  py.FS.mkdirTree(EXERCISE_DIR)
  py.FS.writeFile(`${EXERCISE_DIR}/asyncmod.py`, SOURCE)
  return JSON.parse(await py.runPythonAsync(buildHarness('asyncmod.py', tests))) as HarnessResult
}

describe('python harness', () => {
  it('runs a synchronous check exactly as before', async () => {
    const result = await run([
      check('sync', 'assert double(2) == 4'),
      check('sync fails', 'assert double(2) == 5, "no"'),
    ])
    expect(result.outcomes.map(o => [o.passed, o.message])).toEqual([
      [true, null],
      [false, 'no'],
    ])
  }, 60_000)

  it('lets a check await', async () => {
    const result = await run([
      check('awaits', 'assert (await later(3)) == 3'),
      check('late', 'assert (await later(3)) == 4'),
    ])
    expect(result.outcomes.map(o => o.passed)).toEqual([true, false])
  }, 60_000)

  it('fails a check whose awaited coroutine raises, with its message', async () => {
    const result = await run([check('raises', "await fail('no network')")])
    expect(result.outcomes[0]).toMatchObject({ passed: false, message: 'ValueError: no network' })
  }, 60_000)

  it('fails a check that never finishes as a timeout, and runs the next one', async () => {
    const result = await run([check('hangs', 'await never()', 50), check('after', 'assert double(1) == 2')])
    expect(result.outcomes[0]?.passed).toBe(false)
    expect(result.outcomes[0]?.message).toMatch(/^Timed out after 0\.05 seconds\./)
    expect(result.outcomes[1]?.passed).toBe(true)
    expect(result.loadError).toBeNull()
  }, 60_000)
})
