import type { TestCase } from './types'

/**
 * Time limits for running an exercise.
 *
 * Kept apart from the runners so each Worker imports only the numbers, not
 * the other runner's code.
 */

/** How long one check may wait on a promise before it fails, unless it sets its own `timeout`. */
export const CHECK_TIMEOUT_MS = 2_000

/** Allowance for loading the code and for a synchronous infinite loop to be caught. */
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

const baseTimeout = (language: string): number => {
  if (language === 'python') return PYTHON_TIMEOUT_MS
  if (language === 'jsx' || language === 'tsx') return REACT_TIMEOUT_MS
  return RUN_TIMEOUT_MS
}

/**
 * How long the whole run may take before the Worker is killed.
 *
 * The language's base allowance plus every check's own timeout. Checks wait in
 * sequence, so if each one hangs, each fails with its own timeout message and
 * the run still reports, rather than the Worker being killed part way and
 * every check marked not run. The cost is that a synchronous infinite loop is
 * killed later on an exercise with many checks.
 */
export const runBudget = (tests: TestCase[], language: string): number =>
  tests.reduce((total, test) => total + (test.timeout ?? CHECK_TIMEOUT_MS), baseTimeout(language))
