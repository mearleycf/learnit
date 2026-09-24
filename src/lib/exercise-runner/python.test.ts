import { describe, expect, it } from 'vitest'

import { buildHarness, EXERCISE_DIR, filesToWrite, isPython, moduleNameFor, pyString } from './python'
import type { TestCase } from './types'

const check = (name: string, testFunction: string): TestCase => ({ name, description: '', testFunction })

describe('moduleNameFor', () => {
  it('strips the extension', () => {
    expect(moduleNameFor('solution.py')).toBe('solution')
  })

  it('strips a leading path segment', () => {
    expect(moduleNameFor('./solution.py')).toBe('solution')
  })

  it('leaves a bare name alone', () => {
    expect(moduleNameFor('solution')).toBe('solution')
  })
})

describe('pyString', () => {
  it('quotes a plain string', () => {
    expect(pyString('hello')).toBe('"hello"')
  })

  it('escapes quotes and newlines, so source can be embedded safely', () => {
    expect(pyString('say "hi"\nthen go')).toBe('"say \\"hi\\"\\nthen go"')
  })

  it('escapes a backslash', () => {
    expect(pyString('a\\b')).toBe('"a\\\\b"')
  })
})

describe('buildHarness', () => {
  const harness = buildHarness('solution.py', [
    check('doubles', 'assert double(2) == 4'),
    check('quoted', 'assert name == "Mike"'),
  ])

  it('imports the module by name, without the extension', () => {
    expect(harness).toContain('importlib.import_module("solution")')
  })

  it('puts the exercise directory on the path', () => {
    expect(harness).toContain(EXERCISE_DIR)
  })

  it('reloads, so a second run sees edited source', () => {
    expect(harness).toContain('importlib.reload')
  })

  it('embeds each check, with quotes escaped', () => {
    expect(harness).toContain('"assert double(2) == 4"')
    expect(harness).toContain('assert name == \\"Mike\\"')
  })

  it('distinguishes an assertion failure from any other error', () => {
    expect(harness).toContain('except AssertionError')
    expect(harness).toContain('type(_e).__name__')
  })

  it('captures stdout and restores it afterwards', () => {
    expect(harness).toContain('sys.stdout = _buffer')
    expect(harness).toContain('finally:')
  })

  it('returns JSON as its last expression', () => {
    expect(harness.trimEnd().endsWith('_buffer.getvalue()})')).toBe(true)
    expect(harness).toContain('json.dumps')
  })

  it('handles an exercise with no checks', () => {
    expect(() => buildHarness('solution.py', [])).not.toThrow()
  })
})

describe('filesToWrite', () => {
  it('places files under the exercise directory', () => {
    expect(filesToWrite([{ filename: 'a.py', content: 'x = 1' }])).toEqual([
      { path: `${EXERCISE_DIR}/a.py`, content: 'x = 1' },
    ])
  })

  it('keeps several files', () => {
    expect(
      filesToWrite([
        { filename: 'a.py', content: '' },
        { filename: 'b.py', content: '' },
      ]),
    ).toHaveLength(2)
  })
})

describe('isPython', () => {
  it('recognises python and nothing else', () => {
    expect(isPython('python')).toBe(true)
    expect(isPython('javascript')).toBe(false)
    expect(isPython(undefined)).toBe(false)
  })
})
