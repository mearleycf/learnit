// src/utils/logger.ts
import { Effect, Logger, LogLevel } from 'effect'
import * as Sentry from '@sentry/astro'

// Create a custom logger that includes Sentry for errors
export const customLogger = Logger.make(({ logLevel, message }) => {
  const timestamp = new Date().toISOString()

  // get metadata (component and any other context) from the message
  const metadata = typeof message === 'object' && message !== null ? message : { component: 'unknown' }

  // Format the message
  const formattedMessage = Array.isArray(message) ? message.join(' ') : String(message)

  // Base log entry
  const logEntry = {
    timestamp,
    level: logLevel.label,
    ...metadata,
    message: formattedMessage,
  }

  // Handle different log levels
  switch (logLevel) {
    case LogLevel.Fatal:
    case LogLevel.Error:
      Sentry.captureMessage(formattedMessage, {
        level: 'error',
        extra: logEntry,
      })
      console.error(logEntry)
      break
    case LogLevel.Warning:
      console.warn(logEntry)
      break
    case LogLevel.Info:
      console.info(logEntry)
      break
    case LogLevel.Debug:
      console.debug(logEntry)
      break
    default:
      console.log(logEntry)
  }
})

export type LogInfo = {
  component: string
  message: string
  level: keyof typeof LogLevel
  context: Record<string, unknown>
}

// Create the logger layer
export const LoggerLive = Logger.replace(Logger.defaultLogger, customLogger)

// Helper functions to create annotated effects
export const logWithContext = ({ component, message, level, context }: LogInfo) => {
  const effect =
    level === 'Error'
      ? Effect.logError(message)
      : level === 'Warning'
        ? Effect.logWarning(message)
        : level === 'Debug'
          ? Effect.logDebug(message)
          : Effect.logInfo(message)

  return effect.pipe(
    Effect.annotateLogs({
      component,
      ...context,
    }),
  )
}
