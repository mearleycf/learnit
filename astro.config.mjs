import vercel from '@astrojs/vercel/serverless'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import db from '@astrojs/db'
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
  site: 'https://fivestarcode.cc',
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    }),
    icon(),
    react(),
    db(),
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
