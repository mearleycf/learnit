import { runBudget } from './limits'
import type { SourceFile } from './link'
import { loadFailure } from './run'
import type { RunResult, TestCase } from './types'

/**
 * Runs student code in a Worker and resolves with the outcomes.
 *
 * The Worker is terminated on timeout, which is the only way to interrupt a
 * synchronous infinite loop. The timeout grows with the number of checks, so
 * checks that each hang still report one by one; see `runBudget`. Always
 * resolves; a failure to load or a timeout comes back as a RunResult with
 * `loadError` set.
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
    const timeout = runBudget(tests, language)

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
