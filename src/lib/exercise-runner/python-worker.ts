/// <reference lib="webworker" />
import type { LogEntry } from './capture'
import type { SourceFile } from './link'
import { buildHarness, EXERCISE_DIR, filesToWrite, type HarnessResult } from './python'
import type { RunResult, TestCase } from './types'

export type PythonRunRequest = { files: SourceFile[]; entry: string; tests: TestCase[] }

/** Served from `public/pyodide`, copied there by scripts/copy-pyodide.mjs. */
const PYODIDE_URL = '/pyodide/'

type Pyodide = {
  FS: { mkdirTree: (path: string) => void; writeFile: (path: string, data: string) => void }
  runPythonAsync: (code: string) => Promise<string>
}

/**
 * Pyodide is ~15 MB and takes a moment to start, so it is loaded once and
 * reused across runs in the same Worker.
 */
let runtime: Promise<Pyodide> | null = null

const getRuntime = async (): Promise<Pyodide> => {
  runtime ??= (async () => {
    const { loadPyodide } = (await import(/* @vite-ignore */ `${PYODIDE_URL}pyodide.mjs`)) as {
      loadPyodide: (options: { indexURL: string }) => Promise<Pyodide>
    }
    return loadPyodide({ indexURL: PYODIDE_URL })
  })()
  return runtime
}

const describe = (error: unknown) => (error instanceof Error ? `${error.name}: ${error.message}` : String(error))

/** Splits captured stdout into the log entries the workspace renders. */
const toLogs = (stdout: string): LogEntry[] =>
  stdout
    .split('\n')
    .filter(line => line.length > 0)
    .map(line => ({ level: 'log' as const, text: line, checkIndex: null }))

/**
 * Runs a Python exercise.
 *
 * The student's files go into Pyodide's virtual filesystem, so imports between
 * them resolve the way they would on disk and need no rewriting. The harness
 * runs entirely in Python and hands back one JSON string.
 */
self.onmessage = async (event: MessageEvent<PythonRunRequest>) => {
  const { files, entry, tests } = event.data

  const failed = (message: string): RunResult => ({
    outcomes: tests.map(test => ({
      name: test.name,
      description: test.description,
      passed: false,
      message: 'Not run: the code did not load.',
    })),
    logs: [],
    passed: 0,
    total: tests.length,
    loadError: message,
  })

  try {
    const py = await getRuntime()

    py.FS.mkdirTree(EXERCISE_DIR)
    for (const file of filesToWrite(files)) py.FS.writeFile(file.path, file.content)

    const raw = await py.runPythonAsync(buildHarness(entry, tests))
    const harness = JSON.parse(raw) as HarnessResult

    if (harness.loadError) {
      self.postMessage({ ...failed(harness.loadError), logs: toLogs(harness.stdout) })
      return
    }

    const outcomes = harness.outcomes.map((outcome, index) => ({
      name: outcome.name,
      description: tests[index]?.description ?? '',
      passed: outcome.passed,
      message: outcome.message,
    }))

    self.postMessage({
      outcomes,
      logs: toLogs(harness.stdout),
      passed: outcomes.filter(outcome => outcome.passed).length,
      total: outcomes.length,
      loadError: null,
    } satisfies RunResult)
  } catch (error) {
    self.postMessage(failed(describe(error)))
  }
}
