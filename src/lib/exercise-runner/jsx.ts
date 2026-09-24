import { transform } from 'sucrase'

/**
 * Compiles JSX and points React imports at the bundles served from `public/`.
 *
 * Browsers do not parse JSX, and a Worker has no module resolution for a bare
 * `react` specifier. Both are handled here, before the module graph is linked.
 */

/** Bare specifiers a React exercise may import, and where they are served. */
export const BARE_MODULES: Record<string, string> = {
  react: '/react/react.mjs',
  'react-dom/server': '/react/react-dom-server.mjs',
  'react-dom': '/react/react-dom-server.mjs',
}

/** Matches a bare specifier in any import or re-export form. */
const BARE_SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])([^'".][^'"]*)\2/g

/** True when a file needs the JSX transform. */
export const needsCompiling = (filename: string): boolean => /\.(jsx|tsx)$/.test(filename)

/**
 * Rewrites bare specifiers to served URLs.
 *
 * Anything not in the map is left alone, so an unknown package still fails
 * with a resolution error the student can act on rather than silently
 * resolving to the wrong thing.
 */
export const rewriteBareImports = (source: string, modules = BARE_MODULES): string =>
  source.replace(BARE_SPECIFIER, (whole, lead: string, quote: string, specifier: string) => {
    const target = modules[specifier]
    return target ? `${lead}${quote}${target}${quote}` : whole
  })

export class JsxSyntaxError extends Error {
  override name = 'JsxSyntaxError'
}

/**
 * Turns JSX into `React.createElement` calls.
 *
 * The classic runtime is used rather than the automatic one, because it needs
 * only `React` in scope instead of a second `react/jsx-runtime` module to
 * serve. A syntax error is rethrown with its position, which is the part a
 * student needs.
 */
export const compileJsx = (source: string, filename: string): string => {
  try {
    return transform(source, {
      transforms: filename.endsWith('.tsx') ? ['jsx', 'typescript'] : ['jsx'],
      jsxRuntime: 'classic',
      production: true,
      filePath: filename,
    }).code
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new JsxSyntaxError(`${filename}: ${message}`)
  }
}

/**
 * Prepares one file for the module graph.
 *
 * Compiled files get a React import prepended, since the classic runtime
 * emits `React.createElement` and the student's own file may not import React
 * at all.
 */
export const prepare = (filename: string, source: string, modules = BARE_MODULES): string => {
  if (!needsCompiling(filename)) return rewriteBareImports(source, modules)

  const compiled = compileJsx(source, filename)
  const rewritten = rewriteBareImports(compiled, modules)
  return `import React from ${JSON.stringify(modules.react)}\n${rewritten}`
}
