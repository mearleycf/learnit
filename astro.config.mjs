import vercel from '@astrojs/vercel/serverless'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import db from '@astrojs/db'
import icon from 'astro-icon'

import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://fivestarcode.cc',
  integrations: [tailwind(), sitemap({
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date(),
  }), icon(), react(), db(),
  sentry(
    {
      dsn: "https://74f9aedddb4e8c0d2a80410d26124bbf@o4508195598499840.ingest.us.sentry.io/4508195600596992",
      sourceMapsUploadOptions: {
        project: "learnit",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      }
    }
  )],
  vite: {
    envDir: '.',
    envPrefix: ['PUBLIC_'],
    server: {
      hmr: {
        overlay: false,
      },
      watch: {
        usePolling: true,
      },
    },
    // Add this ssr configuration
    ssr: {
      noExternal: [],
    },
  },
  output: 'server',
  adapter: vercel(),
})
