module.exports = {
  root: true,
  env: { browser: true, es6: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@stylistic/recommended',
  ],
  rules: {},
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', '@stylistic'],
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'db/**/*',
    'public/**/*',
    '**/scripts/**/*',
    'test/**/*',
    'src/env.d.ts',
  ],
}
