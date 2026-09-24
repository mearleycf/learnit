import { mkdir, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { build } from 'esbuild'

/**
 * Bundles React into ESM files the browser can import.
 *
 * React ships as CommonJS, which a Worker cannot import directly, so each
 * entry is bundled into a single ES module and served from `public/react`.
 * Nothing is fetched from a CDN, so exercises still run offline.
 *
 * `react-dom/server` rather than `react-dom` on purpose: checks render a
 * component to a string and assert on the markup, which needs no DOM.
 *
 * Runs before dev and build. `public/react` is gitignored.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const target = join(root, 'public', 'react')

await rm(target, { recursive: true, force: true })
await mkdir(target, { recursive: true })

/**
 * React's public API, re-exported by name.
 *
 * `export * from 'react'` produces no named exports here: React is CommonJS,
 * so esbuild cannot enumerate them statically. Destructuring the default at
 * runtime gives real named exports that a student's `import { useState }`
 * resolves against.
 */
const REACT_EXPORTS = [
  'Children',
  'Fragment',
  'Profiler',
  'StrictMode',
  'Suspense',
  'cloneElement',
  'createContext',
  'createElement',
  'createRef',
  'forwardRef',
  'isValidElement',
  'lazy',
  'memo',
  'startTransition',
  'use',
  'useActionState',
  'useCallback',
  'useContext',
  'useDebugValue',
  'useDeferredValue',
  'useEffect',
  'useId',
  'useImperativeHandle',
  'useInsertionEffect',
  'useLayoutEffect',
  'useMemo',
  'useOptimistic',
  'useReducer',
  'useRef',
  'useState',
  'useSyncExternalStore',
  'useTransition',
  'version',
]

const entries = [
  {
    name: 'react.mjs',
    contents: [
      "import React from 'react'",
      'export default React',
      `export const { ${REACT_EXPORTS.join(', ')} } = React`,
    ].join('\n'),
  },
  {
    name: 'react-dom-server.mjs',
    contents: "export { renderToStaticMarkup, renderToString } from 'react-dom/server.browser'",
  },
]

for (const entry of entries) {
  await build({
    stdin: { contents: entry.contents, resolveDir: root, loader: 'js' },
    outfile: join(target, entry.name),
    bundle: true,
    format: 'esm',
    platform: 'browser',
    // Development builds keep React's warnings, which are worth reading while learning.
    define: { 'process.env.NODE_ENV': '"development"' },
    logLevel: 'warning',
  })
}

console.info(`Built ${entries.length} React bundles into public/react`)
