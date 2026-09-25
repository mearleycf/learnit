/// <reference lib="webworker" />
import { createCapture } from './capture'
import { installDomStub } from './dom-stub'
import { BARE_MODULES, prepare } from './jsx'
import { linkModules, type SourceFile } from './link'
import { loadFailure, runTests } from './run'
import type { RunResult, TestCase } from './types'

export type RunRequest = { files: SourceFile[]; entry: string; tests: TestCase[]; react?: boolean }

type ReactModule = { createElement: (type: unknown, props: unknown) => unknown }
type ServerModule = { renderToStaticMarkup: (element: unknown) => string }

/**
 * Helpers a React exercise's checks are given.
 *
 * `render(Component, props)` returns the component's markup as a string.
 * Rendering to a string needs no DOM, which is what lets component exercises
 * run in a Worker at all. It covers structure, props and conditional
 * branches; it does not cover clicks, state over time or effects.
 */
/**
 * Absolute URLs for the React bundles.
 *
 * Built at runtime rather than written as literals: Vite refuses to resolve a
 * `/public` path seen in source, since those files bypass its transforms. A
 * full URL assembled from the Worker's own origin is opaque to it, and the
 * browser fetches it directly.
 */
const reactModules = (): Record<string, string> =>
  Object.fromEntries(
    Object.entries(BARE_MODULES).map(([name, path]) => [name, new URL(path, self.location.origin).href]),
  )

const reactHelpers = async (modules: Record<string, string>): Promise<Record<string, unknown>> => {
  const [React, server] = (await Promise.all([
    import(/* @vite-ignore */ modules.react as string),
    import(/* @vite-ignore */ modules['react-dom/server'] as string),
  ])) as [ReactModule, ServerModule]

  return {
    React,
    render: (Component: unknown, props: unknown = {}) =>
      server.renderToStaticMarkup(React.createElement(Component, props)),
  }
}

/**
 * Executes student code inside a Worker.
 *
 * The Worker is the sandbox: no DOM, no access to the page, and the host
 * terminates it if it overruns. Files are linked into a module graph of blob
 * URLs so an exercise can span several files that import each other.
 *
 * Console output is captured for the whole run and attributed to whichever
 * check produced it, because a Worker's console goes nowhere the student can
 * see.
 *
 * A stand-in document is installed first. A Worker has no DOM, so an exercise
 * that renders to the page would otherwise die at module load with "document
 * is not defined" before a single check ran. Real DOM behaviour is verified in
 * the preview frame, not here.
 *
 * This is not a security boundary against hostile code, and does not need to
 * be: learnit runs locally and the only author of this code is the person
 * running it. It exists so an infinite loop or a thrown error cannot take the
 * page down with it.
 */
self.onmessage = async (event: MessageEvent<RunRequest>) => {
  const { files, entry, tests, react = false } = event.data
  const urls: string[] = []
  const capture = createCapture(self.console as unknown as Record<string, unknown>)
  const removeDomStub = installDomStub(self as unknown as Record<string, unknown>)

  capture.install()
  try {
    // JSX is compiled and bare React specifiers are pointed at the served
    // bundles before linking, which only understands relative paths.
    const modules = react ? reactModules() : {}
    const prepared = react
      ? files.map(file => ({ ...file, content: prepare(file.filename, file.content, modules) }))
      : files
    const helpers = react ? await reactHelpers(modules) : {}

    const entryUrl = linkModules(prepared, entry, code => {
      const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }))
      urls.push(url)
      return url
    })

    const module = (await import(/* @vite-ignore */ entryUrl)) as Record<string, unknown>
    const result: RunResult = await runTests({ ...helpers, ...module }, tests, {
      onCheckStart: capture.setCheck,
      logs: capture.entries,
    })
    capture.restore()
    self.postMessage(result)
  } catch (error) {
    capture.restore()
    self.postMessage(loadFailure(tests, error, capture.entries))
  } finally {
    capture.restore()
    removeDomStub()
    for (const url of urls) URL.revokeObjectURL(url)
  }
}
