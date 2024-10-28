import vercel from '@astrojs/vercel/serverless'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import icon from 'astro-icon'
import db from '@astrojs/db'

import sentry from '@sentry/astro'

// https://astro.build/config
export default defineConfig({
  site: 'https://fivestarcode.cc',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    }),
    icon(),
    react(),
    db(),
    sentry({
      sourceMapsUploadOptions: {
        dsn: process.env.SENTRY_DSN,
        project: 'learnit',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
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
