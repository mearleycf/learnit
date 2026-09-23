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

/**
 * Runs each check against the student's exports.
 *
 * Every check runs even when an earlier one fails, so the student sees the
 * full picture rather than only the first problem. A check that throws
 * anything at all counts as a failure; an AssertionError reports its own
 * message, everything else is labelled with its error type.
 *
 * This is deliberately free of any browser or Node API so it can be unit
 * tested directly and reused inside a Worker unchanged.
 */
export const runTests = (
  exports: Record<string, unknown>,
  tests: TestCase[],
  options: { assertImpl?: Assert; onCheckStart?: (index: number) => void; logs?: LogEntry[] } = {},
): RunResult => {
  const { assertImpl = assert, onCheckStart, logs = [] } = options
  const names = injectableNames(exports)
  const values = names.map(name => exports[name])

  const outcomes: TestOutcome[] = tests.map((test, index) => {
    onCheckStart?.(index)
    try {
      // eslint-disable-next-line no-new-func -- the check body is authored content, not user input
      const fn = new Function('assert', ...names, `"use strict";\n${test.testFunction}`)
      fn(assertImpl, ...values)
      return { name: test.name, description: test.description, passed: true, message: null }
    } catch (error) {
      return { name: test.name, description: test.description, passed: false, message: describeError(error) }
    }
  })

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
