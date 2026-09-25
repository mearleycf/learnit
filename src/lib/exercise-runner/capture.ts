/**
 * Captures console output produced by student code.
 *
 * The first thing the course teaches is `console.log`, so a student who prints
 * something needs to see it. Worker output goes nowhere by default, so the
 * console is swapped for a collector while their code runs.
 *
 * The console target is passed in rather than reached for, which keeps this
 * free of any global and testable with a plain object.
 */

export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

export type LogEntry = {
  level: LogLevel
  text: string
  /** Index of the check that produced it, or null for module load. */
  checkIndex: number | null
}

export const LEVELS: LogLevel[] = ['log', 'info', 'warn', 'error', 'debug']

/** Longest single entry kept, so one runaway log cannot fill the page. */
export const MAX_TEXT = 2_000

/** Most entries kept per run, for the same reason. */
export const MAX_ENTRIES = 200

type ConsoleLike = Record<string, unknown>

/** Renders one console argument the way a developer expects to read it. */
export const formatArg = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'bigint') return `${value}n`
  if (typeof value === 'function') return value.name ? `[function ${value.name}]` : '[function]'
  if (value instanceof Error) return `${value.name}: ${value.message}`
  if (value === undefined) return 'undefined'

  try {
    return JSON.stringify(value, replaceCircular()) ?? String(value)
  } catch {
    return String(value)
  }
}

/** Replacer that renders a repeated reference rather than throwing on a cycle. */
const replaceCircular = () => {
  const seen = new WeakSet<object>()
  return (_key: string, value: unknown) => {
    if (typeof value !== 'object' || value === null) return value
    if (seen.has(value)) return '[Circular]'
    seen.add(value)
    return value
  }
}

export const formatArgs = (args: unknown[]): string => {
  const text = args.map(formatArg).join(' ')
  return text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT)}… (truncated)` : text
}

export type Capture = {
  entries: LogEntry[]
  /** Which check subsequent output belongs to. Set to null during module load. */
  setCheck: (index: number | null) => void
  install: () => void
  restore: () => void
}

/**
 * Output that is not the student's and should never be shown.
 *
 * Vite's HMR client runs inside the Worker in development and announces
 * itself on the console.
 */
export const isToolingNoise = (text: string): boolean => text.startsWith('[vite]')

export const createCapture = (target: ConsoleLike): Capture => {
  const entries: LogEntry[] = []
  const originals = new Map<string, unknown>()
  let checkIndex: number | null = null
  let dropped = 0

  const record = (level: LogLevel, args: unknown[]) => {
    const text = formatArgs(args)
    if (isToolingNoise(text)) return
    if (entries.length >= MAX_ENTRIES) {
      dropped += 1
      return
    }
    entries.push({ level, text, checkIndex })
  }

  return {
    entries,
    setCheck: index => {
      checkIndex = index
    },
    install: () => {
      for (const level of LEVELS) {
        originals.set(level, target[level])
        target[level] = (...args: unknown[]) => record(level, args)
      }
    },
    restore: () => {
      for (const [level, original] of originals) target[level] = original
      originals.clear()
      if (dropped > 0) {
        entries.push({ level: 'warn', text: `… ${dropped} more entries were not shown.`, checkIndex: null })
        dropped = 0
      }
    },
  }
}
