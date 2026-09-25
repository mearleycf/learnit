import type { SourceFile } from './link'
import { loadFailure } from './run'
import type { RunResult, TestCase } from './types'

/** Hard ceiling on a run, so an infinite loop cannot hang the page. */
export const RUN_TIMEOUT_MS = 5_000

/**
 * Python gets longer, because the first run also starts Pyodide.
 *
 * That is roughly 15 MB of WebAssembly read from disk. Subsequent runs in the
 * same Worker reuse the runtime and finish as quickly as JavaScript ones.
 */
export const PYTHON_TIMEOUT_MS = 60_000

/** React's first run fetches about 1 MB of bundles alongside the student's code. */
export const REACT_TIMEOUT_MS = 20_000

/**
 * Runs student code in a Worker and resolves with the outcomes.
 *
 * The Worker is terminated on timeout, which is the only way to interrupt a
 * synchronous infinite loop. Always resolves; a failure to load or a timeout
 * comes back as a RunResult with `loadError` set.
 */
export const runExercise = (
  files: SourceFile[],
  entry: string,
  tests: TestCase[],
  language = 'javascript',
): Promise<RunResult> =>
  new Promise(resolve => {
    const python = language === 'python'
    const react = language === 'jsx' || language === 'tsx'
    // React's first run also fetches the bundles, so it gets a little longer.
    const timeout = python ? PYTHON_TIMEOUT_MS : react ? REACT_TIMEOUT_MS : RUN_TIMEOUT_MS

    const worker = python
      ? new Worker(new URL('./python-worker.ts', import.meta.url), { type: 'module' })
      : new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })

    const finish = (result: RunResult) => {
      clearTimeout(timer)
      worker.terminate()
      resolve(result)
    }

    const timer = setTimeout(() => {
      finish(
        loadFailure(tests, new Error(`Timed out after ${timeout / 1000} seconds. Check for a loop that never ends.`)),
      )
    }, timeout)

    worker.onmessage = (event: MessageEvent<RunResult>) => finish(event.data)
    worker.onerror = event => finish(loadFailure(tests, new Error(event.message || 'The code could not be run.')))

    worker.postMessage({ files, entry, tests, react })
  })
