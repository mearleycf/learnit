/** @type {import('tailwindcss').Config} */
import fluid, { extract, screens, fontSize } from 'tailwindcss-fluid'
import containerQueries from 'tailwindcss-container-queries'
import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss'

export default {
  content: { files: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'], extract },
  plugins: [fluid, plugin, containerQueries],
  theme: {
    screens,
    fontSize,
    extend: {
      fontFamily: {
        sans: ['"Inter var"', 'Inter', ...defaultTheme.fontFamily.sans],
        display: ['"Righteous"', '"Lilita One"', ...defaultTheme.fontFamily.sans],
        monospace: ['Mononoki', ...defaultTheme.fontFamily.sans],
      },
    },
  },
}
