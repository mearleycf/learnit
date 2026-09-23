/// <reference lib="webworker" />
import { linkModules, type SourceFile } from './link'
import { loadFailure, runTests } from './run'
import type { RunResult, TestCase } from './types'

export type RunRequest = { files: SourceFile[]; entry: string; tests: TestCase[] }

/**
 * Executes student code inside a Worker.
 *
 * The Worker is the sandbox: no DOM, no access to the page, and the host
 * terminates it if it overruns. Files are linked into a module graph of blob
 * URLs so an exercise can span several files that import each other.
 *
 * This is not a security boundary against hostile code, and does not need to
 * be: learnit runs locally and the only author of this code is the person
 * running it. It exists so an infinite loop or a thrown error cannot take the
 * page down with it.
 */
self.onmessage = async (event: MessageEvent<RunRequest>) => {
  const { files, entry, tests } = event.data
  const urls: string[] = []

  try {
    const entryUrl = linkModules(files, entry, code => {
      const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }))
      urls.push(url)
      return url
    })

    const module = (await import(/* @vite-ignore */ entryUrl)) as Record<string, unknown>
    const result: RunResult = runTests({ ...module }, tests)
    self.postMessage(result)
  } catch (error) {
    self.postMessage(loadFailure(tests, error))
  } finally {
    for (const url of urls) URL.revokeObjectURL(url)
  }
}
