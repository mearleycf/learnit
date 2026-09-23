import { loadFailure } from './run'
import type { RunResult, TestCase } from './types'

/** Hard ceiling on a run, so an infinite loop cannot hang the page. */
export const RUN_TIMEOUT_MS = 5_000

/**
 * Runs student code in a Worker and resolves with the outcomes.
 *
 * The Worker is terminated on timeout, which is the only way to interrupt a
 * synchronous infinite loop. Always resolves; a failure to load or a timeout
 * comes back as a RunResult with `loadError` set.
 */
export const runExercise = (code: string, tests: TestCase[]): Promise<RunResult> =>
  new Promise(resolve => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })

    const finish = (result: RunResult) => {
      clearTimeout(timer)
      worker.terminate()
      resolve(result)
    }

    const timer = setTimeout(() => {
      finish(
        loadFailure(
          tests,
          new Error(`Timed out after ${RUN_TIMEOUT_MS / 1000} seconds. Check for a loop that never ends.`),
        ),
      )
    }, RUN_TIMEOUT_MS)

    worker.onmessage = (event: MessageEvent<RunResult>) => finish(event.data)
    worker.onerror = event => finish(loadFailure(tests, new Error(event.message || 'The code could not be run.')))

    worker.postMessage({ code, tests })
  })
