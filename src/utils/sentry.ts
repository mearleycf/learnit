// src/utils/sentry.ts
import * as Sentry from '@sentry/astro'

export const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.SENTRY_DSN,
    environment: import.meta.env.PROD ? 'production' : 'development',
    release: 'learnit@' + process.env.npm_package_version,
    enableTracing: true,
    tracesSampleRate: 1.0,
    debug: !import.meta.env.PROD,
    integrations: [
      Sentry.captureConsoleIntegration(),
      Sentry.httpClientIntegration(),
      Sentry.sessionTimingIntegration(),
    ],
  })
}
