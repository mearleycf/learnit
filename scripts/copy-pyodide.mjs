import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Copies the Pyodide runtime into `public/` so the browser can fetch it.
 *
 * Pyodide loads its WebAssembly and standard library by URL at runtime, so the
 * files have to be served rather than bundled. They are copied rather than
 * committed: 13 MB does not belong in git, and the package already pins the
 * version.
 *
 * Runs before dev and build. `public/pyodide` is gitignored.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'node_modules', 'pyodide')
const target = join(root, 'public', 'pyodide')

/** Everything the loader asks for. Excludes the demo consoles and source maps. */
const KEEP = /\.(wasm|zip|json)$|^pyodide\.(asm\.)?m?js$/

const files = (await readdir(source)).filter(name => KEEP.test(name))

await rm(target, { recursive: true, force: true })
await mkdir(target, { recursive: true })
await Promise.all(files.map(name => cp(join(source, name), join(target, name))))

console.info(`Copied ${files.length} Pyodide files to public/pyodide`)
