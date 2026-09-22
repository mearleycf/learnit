import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import astro from 'eslint-plugin-astro'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist/**', '.astro/**', '.vercel/**', 'db/migrations/**']),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  {
    // Astro generates env.d.ts with triple-slash references.
    files: ['src/env.d.ts'],
    rules: { '@typescript-eslint/triple-slash-reference': 'off' },
  },
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
])
