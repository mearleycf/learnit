import vercel from '@astrojs/vercel/serverless'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      changeFreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    }),
    icon(),
    react(),
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
