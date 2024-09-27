import { defineConfig, envField } from 'astro/config'
import vercel from '@astrojs/vercel/serverless'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'

import react from '@astrojs/react'

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
    envPrefix: ['PUBLIC_', 'SUPABASE_'],
  },
  // prettier-ignore
  env: {
    schema: {
      PUBLIC_ASTRO_CLIENT_API_URL: envField.string({ context: 'client', access: 'public' }),
      PUBLIC_ASTRO_SERVER_API_URL: envField.string({ context: 'server', access: 'public' }),
      PUBLIC_SUPABASE_URL: envField.string({ context: 'client', access: 'public' }),
      PUBLIC_SUPABASE_ANON_KEY: envField.string({ context: 'client', access: 'public' }),
      SUPABASE_SERVICE_ROLE_KEY: envField.string({ context: 'server', access: 'secret' }),
    },
  },
  output: 'server',
  adapter: vercel(),
})
