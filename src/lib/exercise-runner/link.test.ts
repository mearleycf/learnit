import { describe, expect, it } from 'vitest'

import { CircularImportError, linkModules, MissingImportError, orderFiles, parseDeps } from './link'

const file = (filename: string, content: string) => ({ filename, content })

describe('parseDeps', () => {
  it('finds static imports', () => {
    expect(parseDeps("import { a } from './helpers.js'")).toEqual(['helpers'])
  })

  it('finds re-exports and dynamic imports', () => {
    expect(parseDeps("export { a } from './a.js'\nconst m = await import('./b')")).toEqual(['a', 'b'])
  })

  it('treats ./a.js and a as the same module', () => {
    expect(parseDeps("import './a.js'\nimport './a'")).toEqual(['a'])
  })

  it('ignores bare package specifiers', () => {
    expect(parseDeps("import { z } from 'zod'")).toEqual([])
  })

  it('returns nothing for a file with no imports', () => {
    expect(parseDeps('export const a = 1')).toEqual([])
  })
})

describe('orderFiles', () => {
  it('puts dependencies before the files that import them', () => {
    const files = [
      file('main.js', "import { greet } from './greet.js'\nexport const out = greet()"),
      file('greet.js', "export const greet = () => 'hi'"),
    ]
    expect(orderFiles(files, 'main.js').map(f => f.filename)).toEqual(['greet.js', 'main.js'])
  })

  it('handles a chain three deep', () => {
    const files = [file('a.js', "import './b.js'"), file('b.js', "import './c.js'"), file('c.js', 'export const c = 1')]
    expect(orderFiles(files, 'a.js').map(f => f.filename)).toEqual(['c.js', 'b.js', 'a.js'])
  })

  it('includes a shared dependency once', () => {
    const files = [
      file('main.js', "import './a.js'\nimport './b.js'"),
      file('a.js', "import './shared.js'"),
      file('b.js', "import './shared.js'"),
      file('shared.js', 'export const s = 1'),
    ]
    expect(orderFiles(files, 'main.js').map(f => f.filename)).toEqual(['shared.js', 'a.js', 'b.js', 'main.js'])
  })

  it('leaves out files the entry never reaches', () => {
    const files = [file('main.js', 'export const a = 1'), file('orphan.js', 'export const b = 2')]
    expect(orderFiles(files, 'main.js').map(f => f.filename)).toEqual(['main.js'])
  })

  it('reports a cycle with the path that caused it', () => {
    const files = [file('a.js', "import './b.js'"), file('b.js', "import './a.js'")]
    expect(() => orderFiles(files, 'a.js')).toThrow(CircularImportError)
    expect(() => orderFiles(files, 'a.js')).toThrow(/a -> b -> a/)
  })

  it('reports an import with no matching file', () => {
    const files = [file('main.js', "import './nope.js'")]
    expect(() => orderFiles(files, 'main.js')).toThrow(MissingImportError)
  })
})

describe('linkModules', () => {
  const fakeUrls = () => {
    const made: string[] = []
    return {
      made,
      createUrl: (code: string) => {
        made.push(code)
        return `blob:${made.length}`
      },
    }
  }

  it('rewrites a relative specifier to the dependency URL', () => {
    const { made, createUrl } = fakeUrls()
    const files = [
      file('main.js', "import { greet } from './greet.js'\nexport const out = greet()"),
      file('greet.js', "export const greet = () => 'hi'"),
    ]

    const entry = linkModules(files, 'main.js', createUrl)

    expect(entry).toBe('blob:2')
    expect(made[1]).toContain("from 'blob:1'")
    expect(made[1]).not.toContain('./greet.js')
  })

  it('leaves bare specifiers alone', () => {
    const { made, createUrl } = fakeUrls()
    linkModules([file('main.js', "import { z } from 'zod'")], 'main.js', createUrl)
    expect(made[0]).toContain("from 'zod'")
  })

  it('rewrites several specifiers in one file', () => {
    const { made, createUrl } = fakeUrls()
    const files = [
      file('main.js', "import './a.js'\nimport './b.js'"),
      file('a.js', 'export const a = 1'),
      file('b.js', 'export const b = 2'),
    ]
    linkModules(files, 'main.js', createUrl)
    const entrySource = made[2] ?? ''
    expect(entrySource).toContain("'blob:1'")
    expect(entrySource).toContain("'blob:2'")
  })

  it('works for a single file with no imports', () => {
    const { createUrl } = fakeUrls()
    expect(linkModules([file('only.js', 'export const a = 1')], 'only.js', createUrl)).toBe('blob:1')
  })
})
