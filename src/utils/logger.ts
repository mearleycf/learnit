import * as Sentry from '@sentry/astro'

export type LogLevel = 'Debug' | 'Info' | 'Warning' | 'Error' | 'Fatal'

export type LogInfo = {
  component: string
  message: string
  level: LogLevel
  context?: Record<string, unknown>
}

/**
 * Writes a structured log entry to the console, and forwards errors to Sentry.
 *
 * Replaces the previous Effect-based logger. Callers pass a single object; the
 * old call sites that passed positional arguments were silently producing
 * entries with an empty message.
 */
export const logWithContext = ({ component, message, level, context = {} }: LogInfo): void => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    component,
    ...context,
    message,
  }

  switch (level) {
    case 'Fatal':
    case 'Error':
      Sentry.captureMessage(message, { level: 'error', extra: entry })
      console.error(entry)
      break
    case 'Warning':
      console.warn(entry)
      break
    case 'Debug':
      console.debug(entry)
      break
    default:
      console.info(entry)
  }
}
