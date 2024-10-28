// src/utils/sentry.ts
import * as Sentry from '@sentry/astro'

export const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.SENTRY_DSN,
    environment: import.meta.env.PROD ? 'production' : 'development',

    tracesSampleRate: 1.0,
    debug: !import.meta.env.PROD,
  })
}
