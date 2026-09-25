import { describe, expect, it } from 'vitest'

import { AssertionError, assert } from './assert'
import { injectableNames, loadFailure, runTests } from './run'
import type { TestCase } from './types'

const check = (name: string, testFunction: string): TestCase => ({
  name,
  description: `checks ${name}`,
  testFunction,
})

describe('assert', () => {
  it('passes on strict equality and fails otherwise', () => {
    expect(() => assert.strictEqual(1, 1)).not.toThrow()
    expect(() => assert.strictEqual(1, 2)).toThrow(AssertionError)
  })

  it('reports both values in the failure message', () => {
    expect(() => assert.strictEqual('got', 'want')).toThrow('Expected "want", got "got"')
  })

  it('treats NaN as equal to itself, unlike ===', () => {
    expect(() => assert.strictEqual(Number.NaN, Number.NaN)).not.toThrow()
  })

  it('compares structures deeply', () => {
    expect(() => assert.deepStrictEqual({ a: [1, 2] }, { a: [1, 2] })).not.toThrow()
    expect(() => assert.deepStrictEqual({ a: [1, 2] }, { a: [1, 3] })).toThrow(AssertionError)
    expect(() => assert.deepStrictEqual({ a: 1 }, { a: 1, b: 2 })).toThrow(AssertionError)
  })

  it('does not treat an array as equal to an object', () => {
    expect(() => assert.deepStrictEqual([], {})).toThrow(AssertionError)
  })

  it('matches strings against a pattern', () => {
    expect(() => assert.match('not enrolled', /enrolled$/)).not.toThrow()
    expect(() => assert.match('enrolled x', /enrolled$/)).toThrow(AssertionError)
    expect(() => assert.match(42, /4/)).toThrow(AssertionError)
  })

  it('checks that a function throws', () => {
    expect(() =>
      assert.throws(() => {
        throw new Error('boom')
      }),
    ).not.toThrow()
    expect(() => assert.throws(() => 1)).toThrow(AssertionError)
  })
})

describe('injectableNames', () => {
  it('keeps valid identifiers', () => {
    expect(injectableNames({ courseName: 1, _x: 2, $y: 3 })).toEqual(['courseName', '_x', '$y'])
  })

  it('drops names that are not identifiers', () => {
    expect(injectableNames({ 'not-valid': 1, ok: 2 })).toEqual(['ok'])
  })

  it('refuses to shadow assert', () => {
    expect(injectableNames({ assert: 1, ok: 2 })).toEqual(['ok'])
  })
})

describe('runTests', () => {
  const exports = {
    courseName: 'JavaScript Fundamentals',
    lessonsCompleted: 0,
    isEnrolled: true,
    describeProgress: (enrolled = true) =>
      `JavaScript Fundamentals: 0 lessons done (${enrolled ? 'enrolled' : 'not enrolled'})`,
  }

  it('passes every check for a correct solution', () => {
    const result = runTests(exports, [
      check('name', "assert.strictEqual(courseName, 'JavaScript Fundamentals')"),
      check('count', 'assert.strictEqual(lessonsCompleted, 0)'),
      check('enrolled', 'assert.strictEqual(isEnrolled, true)'),
      check('not enrolled', 'assert.match(describeProgress(false), /\\(not enrolled\\)$/)'),
    ])

    expect(result.passed).toBe(4)
    expect(result.total).toBe(4)
    expect(result.outcomes.every(o => o.passed)).toBe(true)
  })

  it('runs later checks even after one fails', () => {
    const result = runTests(exports, [
      check('fails', "assert.strictEqual(courseName, 'Wrong')"),
      check('passes', 'assert.strictEqual(lessonsCompleted, 0)'),
    ])

    expect(result.outcomes.map(o => o.passed)).toEqual([false, true])
    expect(result.passed).toBe(1)
  })

  it('reports the assertion message on failure', () => {
    const result = runTests(exports, [check('fails', "assert.strictEqual(courseName, 'Wrong')")])
    expect(result.outcomes[0]?.message).toContain('Expected "Wrong"')
  })

  it('turns a thrown runtime error into a failure, not a crash', () => {
    const result = runTests(exports, [check('boom', 'missingFunction()')])
    expect(result.outcomes[0]?.passed).toBe(false)
    expect(result.outcomes[0]?.message).toMatch(/ReferenceError/)
  })

  it('turns a syntax error in a check into a failure', () => {
    const result = runTests(exports, [check('bad syntax', 'this is not javascript')])
    expect(result.outcomes[0]?.passed).toBe(false)
    expect(result.outcomes[0]?.message).toMatch(/SyntaxError/)
  })

  it('handles an empty check list', () => {
    const result = runTests(exports, [])
    expect(result).toMatchObject({ passed: 0, total: 0, loadError: null })
  })

  it('does not leak globals between checks', () => {
    const result = runTests(exports, [
      check('sets', 'globalThis.__leak === undefined || assert.ok(false)'),
      check('reads', "assert.strictEqual(typeof leakedVariable, 'undefined')"),
    ])
    expect(result.outcomes[1]?.passed).toBe(true)
  })
})

describe('loadFailure', () => {
  it('marks every check as not run and records the cause', () => {
    const result = loadFailure([check('a', 'assert.ok(true)')], new SyntaxError('Unexpected token'))
    expect(result.passed).toBe(0)
    expect(result.outcomes[0]?.passed).toBe(false)
    expect(result.outcomes[0]?.message).toBe('Not run: the code did not load.')
    expect(result.loadError).toBe('SyntaxError: Unexpected token')
  })
})
