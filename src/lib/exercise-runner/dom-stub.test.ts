import { describe, expect, it } from 'vitest'

import { createDocument, createElement, installDomStub } from './dom-stub'

describe('createElement', () => {
  it('accepts writes to the usual properties', () => {
    const element = createElement()
    element.innerHTML = '<li>a</li>'
    element.textContent = 'hello'
    expect(element.innerHTML).toBe('<li>a</li>')
    expect(element.textContent).toBe('hello')
  })

  it('collects appended children', () => {
    const parent = createElement()
    const child = createElement()
    parent.appendChild(child)
    expect(parent.children).toHaveLength(1)
  })

  it('round-trips attributes and returns null for missing ones', () => {
    const element = createElement()
    element.setAttribute('id', 'x')
    expect(element.getAttribute('id')).toBe('x')
    expect(element.getAttribute('missing')).toBeNull()
  })

  it('absorbs event listener calls', () => {
    expect(() => createElement().addEventListener()).not.toThrow()
  })
})

describe('createDocument', () => {
  it('returns the same element for the same selector', () => {
    const document = createDocument()
    const first = document.querySelector('#lessons')
    first.innerHTML = '<li>a</li>'
    expect(document.querySelector('#lessons').innerHTML).toBe('<li>a</li>')
  })

  it('returns different elements for different selectors', () => {
    const document = createDocument()
    expect(document.querySelector('#a')).not.toBe(document.querySelector('#b'))
  })

  it('treats getElementById as querySelector with a hash', () => {
    const document = createDocument()
    document.getElementById('summary').textContent = 'done'
    expect(document.querySelector('#summary').textContent).toBe('done')
  })

  it('records what was written', () => {
    const document = createDocument()
    document.querySelector('#lessons').innerHTML = '<li>a</li>'
    expect(document.written.get('#lessons')?.innerHTML).toBe('<li>a</li>')
  })
})

describe('installDomStub', () => {
  it('lets DOM code run without throwing', () => {
    const scope: Record<string, unknown> = {}
    const restore = installDomStub(scope)

    const document = scope.document as ReturnType<typeof createDocument>
    expect(() => {
      document.querySelector('#lessons').innerHTML = '<li>a</li>'
    }).not.toThrow()

    restore()
    expect(scope.document).toBeUndefined()
  })

  it('never shadows a real document', () => {
    const real = { marker: true }
    const scope: Record<string, unknown> = { document: real }
    const restore = installDomStub(scope)
    expect(scope.document).toBe(real)
    restore()
    expect(scope.document).toBe(real)
  })
})
