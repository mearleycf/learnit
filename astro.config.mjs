import { defineConfig, envField } from 'astro/config'
import vercel from '@astrojs/vercel/serverless'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
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
  ],
  env: {
    schema: {
      CLIENT_API_URL: envField.string({ context: 'client', access: 'public' }),
      SERVER_API_URL: envField.string({ context: 'server', access: 'public' }),
      API_SECRET: envField.string({ context: 'server', access: 'secret' }),
    },
  },
  output: 'server',
  adapter: vercel(),
})
