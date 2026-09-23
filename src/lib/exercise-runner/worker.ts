/// <reference lib="webworker" />
import { loadFailure, runTests } from './run'
import type { RunResult, TestCase } from './types'

export type RunRequest = { code: string; tests: TestCase[] }

/**
 * Executes student code inside a Worker.
 *
 * The Worker is the sandbox: it has no DOM, no access to the page, and is
 * terminated by the host if it overruns. The code is loaded as a module from a
 * blob URL so `export` works exactly as it does in the editor.
 *
 * This is not a security boundary against hostile code, and does not need to
 * be: learnit runs locally and the only author of this code is the person
 * running it. It exists to stop an infinite loop or a thrown error from taking
 * the page down with it.
 */
self.onmessage = async (event: MessageEvent<RunRequest>) => {
  const { code, tests } = event.data
  let url: string | null = null

  try {
    url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }))
    const module = (await import(/* @vite-ignore */ url)) as Record<string, unknown>
    const result: RunResult = runTests({ ...module }, tests)
    self.postMessage(result)
  } catch (error) {
    self.postMessage(loadFailure(tests, error))
  } finally {
    if (url) URL.revokeObjectURL(url)
  }
}
