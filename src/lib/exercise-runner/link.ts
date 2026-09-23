/**
 * Links a set of student files into one loadable module graph.
 *
 * Exercises can span several files that import each other. A Worker has no
 * module resolver for such files, so each one becomes a blob URL and every
 * relative specifier is rewritten to point at the blob of its target. Blobs
 * must exist before they can be referenced, so files are created
 * dependency-first.
 *
 * Creating the blob is injected rather than called directly, which keeps this
 * module free of browser APIs and testable in Node.
 */

export type SourceFile = { filename: string; content: string }

/**
 * Matches the relative specifier in every import form that can appear here:
 * `import … from '…'`, `export … from '…'`, `import('…')` and the
 * side-effect-only `import '…'`.
 */
const SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])(\.\.?\/[^'"]+)\2/g

/** Strips a leading `./` and any extension, so `./a.js` and `a` compare equal. */
const normalise = (specifier: string): string => specifier.replace(/^\.\//, '').replace(/\.[jt]s$/, '')

const key = (filename: string): string => normalise(filename)

/** Relative specifiers a source file imports, normalised to bare names. */
export const parseDeps = (source: string): string[] => {
  const found = new Set<string>()
  for (const match of source.matchAll(SPECIFIER)) {
    if (match[3]) found.add(normalise(match[3]))
  }
  return [...found]
}

export class CircularImportError extends Error {
  override name = 'CircularImportError'
}

export class MissingImportError extends Error {
  override name = 'MissingImportError'
}

/**
 * Orders files so every file comes after the files it imports.
 *
 * Only files reachable from the entry are included; an unused file is not
 * loaded. Throws on a cycle or an import with no matching file, both of which
 * are authoring mistakes worth surfacing rather than silently dropping.
 */
export const orderFiles = (files: SourceFile[], entry: string): SourceFile[] => {
  const byKey = new Map(files.map(file => [key(file.filename), file]))
  const ordered: SourceFile[] = []
  const done = new Set<string>()
  const visiting = new Set<string>()

  const visit = (name: string, trail: string[]): void => {
    if (done.has(name)) return
    if (visiting.has(name)) {
      throw new CircularImportError(`Circular import: ${[...trail, name].join(' -> ')}`)
    }

    const file = byKey.get(name)
    if (!file) throw new MissingImportError(`No file named "${name}" in this exercise.`)

    visiting.add(name)
    for (const dep of parseDeps(file.content)) visit(dep, [...trail, name])
    visiting.delete(name)

    done.add(name)
    ordered.push(file)
  }

  visit(key(entry), [])
  return ordered
}

/**
 * Builds the module graph and returns the entry's URL.
 *
 * `createUrl` turns source text into a URL the runtime can import.
 */
export const linkModules = (files: SourceFile[], entry: string, createUrl: (code: string) => string): string => {
  const urls = new Map<string, string>()

  for (const file of orderFiles(files, entry)) {
    const rewritten = file.content.replace(SPECIFIER, (whole, lead: string, quote: string, specifier: string) => {
      const target = urls.get(normalise(specifier))
      return target ? `${lead}${quote}${target}${quote}` : whole
    })
    urls.set(key(file.filename), createUrl(rewritten))
  }

  const entryUrl = urls.get(key(entry))
  if (!entryUrl) throw new MissingImportError(`No entry file named "${entry}".`)
  return entryUrl
}
