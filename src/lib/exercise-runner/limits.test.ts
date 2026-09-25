import { describe, expect, it } from 'vitest'

import { CHECK_TIMEOUT_MS, PYTHON_TIMEOUT_MS, REACT_TIMEOUT_MS, RUN_TIMEOUT_MS, runBudget } from './limits'
import type { TestCase } from './types'

const check = (timeout?: number): TestCase => ({
  name: 'c',
  description: '',
  testFunction: 'assert.ok(true)',
  ...(timeout === undefined ? {} : { timeout }),
})

describe('runBudget', () => {
  it('is the base timeout when there are no checks', () => {
    expect(runBudget([], 'javascript')).toBe(RUN_TIMEOUT_MS)
  })

  it('adds the default check timeout for every check', () => {
    expect(runBudget([check(), check(), check()], 'javascript')).toBe(RUN_TIMEOUT_MS + 3 * CHECK_TIMEOUT_MS)
  })

  it("uses a check's own timeout in place of the default", () => {
    expect(runBudget([check(500), check()], 'javascript')).toBe(RUN_TIMEOUT_MS + 500 + CHECK_TIMEOUT_MS)
  })

  it('starts from the React base for JSX and TSX', () => {
    expect(runBudget([check()], 'jsx')).toBe(REACT_TIMEOUT_MS + CHECK_TIMEOUT_MS)
    expect(runBudget([check()], 'tsx')).toBe(REACT_TIMEOUT_MS + CHECK_TIMEOUT_MS)
  })

  it('starts from the Python base for Python', () => {
    expect(runBudget([check()], 'python')).toBe(PYTHON_TIMEOUT_MS + CHECK_TIMEOUT_MS)
  })

  it('always outlasts every check timing out in turn, so each keeps its own outcome', () => {
    const tests = [check(), check(), check()]
    const checksAlone = tests.reduce((sum, test) => sum + (test.timeout ?? CHECK_TIMEOUT_MS), 0)
    expect(runBudget(tests, 'javascript')).toBeGreaterThan(checksAlone)
  })
})
