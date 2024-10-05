import { defineConfig, envField } from 'astro/config'
import starlightVersions from 'starlight-versions'
import vercel from '@astrojs/vercel/serverless'
import starlight from '@astrojs/starlight'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
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
    starlight({
      title: 'Learnit Platform Documentation',
      description:
        'Learnit is a learning platform built initially to support learning programming languages and frameworks. However, the platform is content agnostic, and can ultimately be used for any course-based content.',
      dir: 'ltr',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
      },
      social: {
        github: 'https://github.com/mearleycf/learnit',
      },
      useStarlightDarkModeSwitch: true,
      lastUpdated: true,
      credits: true,
      plugins: [
        starlightVersions({
          versions: [{ slug: '1.0.0', label: 'v1.0.0' }],
          current: { label: 'v1.0.0', redirect: 'same-page' },
        }),
      ],
    }),
    mdx(),
  ],
  vite: {
    envDir: '.',
    envPrefix: ['PUBLIC_', 'SUPABASE_'],
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
      noExternal: ['@supabase/supabase-js'],
    },
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
