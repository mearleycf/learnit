/**
 * Assertion helpers available to exercise checks.
 *
 * Deliberately small and dependency-free: the same object is handed to code
 * running in a Worker, so it cannot rely on anything Node-specific.
 */
export class AssertionError extends Error {
  override name = 'AssertionError'
}

const show = (value: unknown): string => {
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'bigint') return `${value}n`
  if (typeof value === 'function') return value.name ? `[function ${value.name}]` : '[function]'
  try {
    return JSON.stringify(value) ?? String(value)
  } catch {
    return String(value)
  }
}

const fail = (message: string): never => {
  throw new AssertionError(message)
}

/** Structural equality for the plain data exercises deal in. */
const deepEqual = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false

  const aKeys = Object.keys(a as object)
  const bKeys = Object.keys(b as object)
  if (aKeys.length !== bKeys.length) return false

  return aKeys.every(
    key =>
      Object.hasOwn(b as object, key) &&
      deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]),
  )
}

export const assert = {
  ok(value: unknown, message?: string): void {
    if (!value) fail(message ?? `Expected a truthy value, got ${show(value)}`)
  },

  strictEqual(actual: unknown, expected: unknown, message?: string): void {
    if (!Object.is(actual, expected)) fail(message ?? `Expected ${show(expected)}, got ${show(actual)}`)
  },

  notStrictEqual(actual: unknown, expected: unknown, message?: string): void {
    if (Object.is(actual, expected)) fail(message ?? `Expected something other than ${show(expected)}`)
  },

  deepStrictEqual(actual: unknown, expected: unknown, message?: string): void {
    if (!deepEqual(actual, expected)) fail(message ?? `Expected ${show(expected)}, got ${show(actual)}`)
  },

  match(value: unknown, pattern: RegExp, message?: string): void {
    if (typeof value !== 'string') fail(message ?? `Expected a string to match ${pattern}, got ${show(value)}`)
    if (!pattern.test(value as string)) fail(message ?? `Expected ${show(value)} to match ${pattern}`)
  },

  throws(fn: () => unknown, message?: string): void {
    try {
      fn()
    } catch {
      return
    }
    fail(message ?? 'Expected the function to throw')
  },
}

export type Assert = typeof assert
