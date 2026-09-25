import { type Assert, AssertionError, assert } from './assert'
import type { LogEntry } from './capture'
import type { RunResult, TestCase, TestOutcome } from './types'

/** Identifiers a check may not shadow, because they are the check's own scope. */
const RESERVED = new Set(['assert'])

/**
 * Names from the student's module that can be injected as bare identifiers.
 *
 * Checks are authored as `assert.strictEqual(courseName, '…')`, so exported
 * bindings have to be in scope. Anything that is not a valid identifier, or
 * that would collide with `assert`, is skipped rather than breaking the whole
 * run.
 */
export const injectableNames = (exports: Record<string, unknown>): string[] =>
  Object.keys(exports).filter(name => /^[A-Za-z_$][\w$]*$/.test(name) && !RESERVED.has(name))

const describeError = (error: unknown): string => {
  if (error instanceof AssertionError) return error.message
  if (error instanceof Error) return `${error.name}: ${error.message}`
  return String(error)
}

/** How long one check may wait on a promise before it fails, unless it sets its own `timeout`. */
export const CHECK_TIMEOUT_MS = 2_000

/**
 * Builds a check as an async function, so its body may `await`.
 *
 * A body with no `await` still runs synchronously up to its end, so a
 * synchronous check behaves as it always did; only its result arrives as a
 * promise.
 */
const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor as new (
  ...args: string[]
) => (...args: unknown[]) => Promise<unknown>

class CheckTimeout extends Error {}

/**
 * Settles with the check, or rejects once `ms` passes.
 *
 * This only catches a promise that never settles. A synchronous infinite loop
 * never yields to the timer; the per-run timeout in `client.ts`, which kills
 * the Worker, is still the guard for that.
 */
const withTimeout = (promise: Promise<unknown>, ms: number): Promise<unknown> => {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise((_resolve, reject) => {
    timer = setTimeout(
      () => reject(new CheckTimeout(`Timed out after ${ms / 1000} seconds. Check for a promise that never settles.`)),
      ms,
    )
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

/**
 * Runs each check against the student's exports, one at a time, in order.
 *
 * Every check runs even when an earlier one fails, so the student sees the
 * full picture rather than only the first problem. A check that throws or
 * rejects counts as a failure; an AssertionError reports its own message,
 * everything else is labelled with its error type. A check that is still
 * waiting after its timeout fails with a timeout message and the next one
 * starts.
 *
 * Checks run strictly in sequence, so console output after an `await` still
 * belongs to the check `onCheckStart` last named. The exception is a check
 * that timed out: its abandoned promise may log later, under whichever check
 * is running by then.
 *
 * This is deliberately free of any browser or Node API so it can be unit
 * tested directly and reused inside a Worker unchanged.
 */
export const runTests = async (
  exports: Record<string, unknown>,
  tests: TestCase[],
  options: {
    assertImpl?: Assert
    onCheckStart?: (index: number) => void
    logs?: LogEntry[]
    checkTimeoutMs?: number
  } = {},
): Promise<RunResult> => {
  const { assertImpl = assert, onCheckStart, logs = [], checkTimeoutMs = CHECK_TIMEOUT_MS } = options
  const names = injectableNames(exports)
  const values = names.map(name => exports[name])

  const outcomes: TestOutcome[] = []
  for (const [index, test] of tests.entries()) {
    onCheckStart?.(index)
    try {
      // The check body is authored content, not user input.
      const fn = new AsyncFunction('assert', ...names, `"use strict";\n${test.testFunction}`)
      await withTimeout(fn(assertImpl, ...values), test.timeout ?? checkTimeoutMs)
      outcomes.push({ name: test.name, description: test.description, passed: true, message: null })
    } catch (error) {
      const message = error instanceof CheckTimeout ? error.message : describeError(error)
      outcomes.push({ name: test.name, description: test.description, passed: false, message })
    }
  }

  return {
    outcomes,
    logs,
    passed: outcomes.filter(outcome => outcome.passed).length,
    total: outcomes.length,
    loadError: null,
  }
}

/** Result shape for code that could not be loaded at all. */
export const loadFailure = (tests: TestCase[], error: unknown, logs: LogEntry[] = []): RunResult => ({
  outcomes: tests.map(test => ({
    name: test.name,
    description: test.description,
    passed: false,
    message: 'Not run: the code did not load.',
  })),
  logs,
  passed: 0,
  total: tests.length,
  loadError: describeError(error),
})
