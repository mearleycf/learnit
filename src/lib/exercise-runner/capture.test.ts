import { describe, expect, it } from 'vitest'

import { createCapture, formatArg, formatArgs, isToolingNoise, MAX_ENTRIES, MAX_TEXT } from './capture'

type Noop = (...args: unknown[]) => void
type FakeConsole = { log: Noop; info: Noop; warn: Noop; error: Noop; debug: Noop }

/** Stand-in for the console, so nothing global is touched. */
const fakeConsole = (): FakeConsole => ({
  log: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
})

describe('formatArg', () => {
  it('leaves a string as it is, without quotes', () => {
    expect(formatArg('hello')).toBe('hello')
  })

  it('renders primitives readably', () => {
    expect(formatArg(42)).toBe('42')
    expect(formatArg(true)).toBe('true')
    expect(formatArg(null)).toBe('null')
    expect(formatArg(undefined)).toBe('undefined')
    expect(formatArg(10n)).toBe('10n')
  })

  it('names a function when it has one', () => {
    expect(formatArg(function greet() {})).toBe('[function greet]')
    expect(formatArg(() => {})).toContain('function')
  })

  it('renders an error as name and message', () => {
    expect(formatArg(new TypeError('bad'))).toBe('TypeError: bad')
  })

  it('serialises plain data', () => {
    expect(formatArg({ a: 1, b: [2, 3] })).toBe('{"a":1,"b":[2,3]}')
  })

  it('survives a circular structure', () => {
    const circular: Record<string, unknown> = { name: 'x' }
    circular.self = circular
    expect(formatArg(circular)).toContain('[Circular]')
  })
})

describe('formatArgs', () => {
  it('joins several arguments with a space', () => {
    expect(formatArgs(['count:', 3])).toBe('count: 3')
  })

  it('truncates a very long entry', () => {
    const out = formatArgs(['x'.repeat(MAX_TEXT + 500)])
    expect(out).toContain('(truncated)')
    expect(out.length).toBeLessThan(MAX_TEXT + 40)
  })
})

describe('createCapture', () => {
  it('collects output instead of printing it', () => {
    const target = fakeConsole()
    const capture = createCapture(target)
    capture.install()
    target.log('hello', 1)
    capture.restore()

    expect(capture.entries).toEqual([{ level: 'log', text: 'hello 1', checkIndex: null }])
  })

  it('records the level each entry came from', () => {
    const target = fakeConsole()
    const capture = createCapture(target)
    capture.install()
    target.warn('careful')
    target.error('broken')
    capture.restore()

    expect(capture.entries.map(e => e.level)).toEqual(['warn', 'error'])
  })

  it('attributes output to the current check', () => {
    const target = fakeConsole()
    const capture = createCapture(target)
    capture.install()
    target.log('during load')
    capture.setCheck(2)
    target.log('during check 2')
    capture.restore()

    expect(capture.entries.map(e => e.checkIndex)).toEqual([null, 2])
  })

  it('puts the original console back', () => {
    const target = fakeConsole()
    const original = target.log
    const capture = createCapture(target)
    capture.install()
    expect(target.log).not.toBe(original)
    capture.restore()
    expect(target.log).toBe(original)
  })

  it('caps the number of entries and says how many were dropped', () => {
    const target = fakeConsole()
    const capture = createCapture(target)
    capture.install()
    for (let i = 0; i < MAX_ENTRIES + 5; i += 1) target.log(i)
    capture.restore()

    expect(capture.entries).toHaveLength(MAX_ENTRIES + 1)
    expect(capture.entries.at(-1)?.text).toContain('5 more entries')
  })

  it('adds no note when nothing was dropped', () => {
    const target = fakeConsole()
    const capture = createCapture(target)
    capture.install()
    target.log('one')
    capture.restore()

    expect(capture.entries).toHaveLength(1)
  })
})

describe('isToolingNoise', () => {
  it('recognises Vite dev client output', () => {
    expect(isToolingNoise('[vite] connected.')).toBe(true)
  })

  it('leaves student output alone', () => {
    expect(isToolingNoise('my value is [vite]')).toBe(false)
    expect(isToolingNoise('hello')).toBe(false)
  })
})

describe('createCapture and tooling noise', () => {
  it('drops the dev client chatter without counting it', () => {
    const target = fakeConsole()
    const capture = createCapture(target)
    capture.install()
    target.log('[vite] connected.')
    target.log('mine')
    capture.restore()

    expect(capture.entries.map(e => e.text)).toEqual(['mine'])
  })
})
