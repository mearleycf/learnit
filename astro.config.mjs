import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import sentry from '@sentry/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
  site: 'https://fivestarcode.cc',
  output: 'server',
  adapter: vercel(),
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    }),
    icon(),
    // Sentry stays inert without a DSN, so local development needs no secrets.
    sentry({
      sourceMapsUploadOptions: {
        dsn: process.env.SENTRY_DSN,
        project: 'learnit',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
  vite: {
    // Tailwind 4 is a Vite plugin; the former @astrojs/tailwind integration is
    // capped at Astro 5 and Tailwind 3, so it was removed.
    plugins: [tailwindcss()],
    envDir: '.',
    envPrefix: ['PUBLIC_'],
  },
})
