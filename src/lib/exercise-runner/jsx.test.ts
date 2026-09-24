import { describe, expect, it } from 'vitest'

import { BARE_MODULES, compileJsx, JsxSyntaxError, needsCompiling, prepare, rewriteBareImports } from './jsx'

describe('needsCompiling', () => {
  it('recognises jsx and tsx', () => {
    expect(needsCompiling('Row.jsx')).toBe(true)
    expect(needsCompiling('Row.tsx')).toBe(true)
  })

  it('leaves plain files alone', () => {
    expect(needsCompiling('helpers.js')).toBe(false)
    expect(needsCompiling('data.py')).toBe(false)
  })
})

describe('rewriteBareImports', () => {
  it('points react at the served bundle', () => {
    expect(rewriteBareImports("import { useState } from 'react'")).toContain(BARE_MODULES.react ?? '')
  })

  it('rewrites react-dom/server', () => {
    expect(rewriteBareImports("import { renderToString } from 'react-dom/server'")).toContain('react-dom-server.mjs')
  })

  it('leaves relative specifiers for the linker', () => {
    expect(rewriteBareImports("import { a } from './helpers.js'")).toContain("'./helpers.js'")
  })

  it('leaves an unknown package alone, so it fails visibly', () => {
    expect(rewriteBareImports("import x from 'lodash'")).toContain("'lodash'")
  })

  it('handles a side-effect import', () => {
    expect(rewriteBareImports("import 'react'")).toContain('react.mjs')
  })
})

describe('compileJsx', () => {
  it('turns an element into createElement', () => {
    const out = compileJsx('export const a = <li>hi</li>', 'a.jsx')
    expect(out).toContain('React.createElement')
    expect(out).not.toContain('<li>')
  })

  it('keeps props and children', () => {
    const out = compileJsx('export const a = <li className="x">{name}</li>', 'a.jsx')
    expect(out).toContain('className')
    expect(out).toContain('name')
  })

  it('strips types from tsx', () => {
    const out = compileJsx('export const a = (n: number): number => n', 'a.tsx')
    expect(out).not.toContain(': number')
  })

  it('reports a syntax error with the filename', () => {
    expect(() => compileJsx('export const a = <li>', 'broken.jsx')).toThrow(JsxSyntaxError)
    expect(() => compileJsx('export const a = <li>', 'broken.jsx')).toThrow(/broken\.jsx/)
  })
})

describe('prepare', () => {
  it('compiles and adds the React import a compiled file needs', () => {
    const out = prepare('Row.jsx', 'export const Row = () => <li>x</li>')
    expect(out.startsWith('import React from')).toBe(true)
    expect(out).toContain('React.createElement')
  })

  it('rewrites the student’s own react import too', () => {
    const out = prepare('Row.jsx', "import { useState } from 'react'\nexport const Row = () => <li/>")
    expect(out).not.toContain("from 'react'")
    expect(out.match(/react\.mjs/g)?.length).toBe(2)
  })

  it('does not add a React import to a plain module', () => {
    const out = prepare('helpers.js', 'export const a = 1')
    expect(out).toBe('export const a = 1')
  })
})
