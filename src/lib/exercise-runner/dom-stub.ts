/**
 * A stand-in DOM for grading.
 *
 * Checks run in a Worker, which has no DOM. An exercise that renders to the
 * page will call `document.querySelector` at module load, and without this
 * the whole run dies with "document is not defined" before a single check
 * executes.
 *
 * This is deliberately not a DOM implementation. It absorbs the calls a
 * teaching exercise makes and records what was written, so the pure functions
 * around them can still be graded. Real DOM behaviour is verified in the
 * preview frame, which has an actual document.
 */

export type StubElement = {
  innerHTML: string
  textContent: string
  className: string
  readonly children: StubElement[]
  querySelector: (selector: string) => StubElement
  querySelectorAll: (selector: string) => StubElement[]
  appendChild: (child: StubElement) => StubElement
  append: (...children: StubElement[]) => void
  setAttribute: (name: string, value: string) => void
  getAttribute: (name: string) => string | null
  addEventListener: () => void
  removeEventListener: () => void
}

export const createElement = (): StubElement => {
  const attributes = new Map<string, string>()
  const children: StubElement[] = []

  const element: StubElement = {
    innerHTML: '',
    textContent: '',
    className: '',
    children,
    querySelector: () => createElement(),
    querySelectorAll: () => [],
    appendChild: child => {
      children.push(child)
      return child
    },
    append: (...items) => {
      children.push(...items)
    },
    setAttribute: (name, value) => {
      attributes.set(name, value)
    },
    getAttribute: name => attributes.get(name) ?? null,
    addEventListener: () => {},
    removeEventListener: () => {},
  }
  return element
}

export type StubDocument = {
  querySelector: (selector: string) => StubElement
  querySelectorAll: (selector: string) => StubElement[]
  getElementById: (id: string) => StubElement
  createElement: (tag: string) => StubElement
  body: StubElement
  /** Every element handed out, keyed by the selector that asked for it. */
  readonly written: Map<string, StubElement>
}

export const createDocument = (): StubDocument => {
  const written = new Map<string, StubElement>()

  /** The same selector returns the same element, so a second read sees the first write. */
  const forSelector = (selector: string): StubElement => {
    const existing = written.get(selector)
    if (existing) return existing
    const element = createElement()
    written.set(selector, element)
    return element
  }

  return {
    querySelector: forSelector,
    querySelectorAll: () => [],
    getElementById: id => forSelector(`#${id}`),
    createElement: () => createElement(),
    body: createElement(),
    written,
  }
}

type Scope = Record<string, unknown>

/**
 * Installs the stub on a scope and returns a function that removes it.
 *
 * Only fills in what is missing, so it never shadows a real DOM.
 */
export const installDomStub = (scope: Scope): (() => void) => {
  const added: string[] = []
  const document = createDocument()

  if (scope.document === undefined) {
    scope.document = document
    added.push('document')
  }
  if (scope.window === undefined) {
    scope.window = scope
    added.push('window')
  }

  return () => {
    for (const name of added) delete scope[name]
  }
}
