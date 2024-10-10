/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter var"', 'Inter', ...defaultTheme.fontFamily.sans],
        display: ['"Righteous"', '"Lilita One"', ...defaultTheme.fontFamily.sans],
        monospace: ['Mononoki', ...defaultTheme.fontFamily.sans],
      },
    },
  },
}
