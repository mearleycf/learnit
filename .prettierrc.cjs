module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  singleAttributePerLine: false,
  arrowParens: 'avoid',
  plugins: ['prettier-plugin-astro', 'prettier-plugin-packagejson', 'prettier-plugin-tailwindcss'],
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
}
