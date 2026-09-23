/// <reference lib="webworker" />
import { createCapture } from './capture'
import { installDomStub } from './dom-stub'
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
  const { files, entry, tests } = event.data
  const urls: string[] = []
  const capture = createCapture(self.console as unknown as Record<string, unknown>)
  const removeDomStub = installDomStub(self as unknown as Record<string, unknown>)

  capture.install()
  try {
    const entryUrl = linkModules(files, entry, code => {
      const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }))
      urls.push(url)
      return url
    })

    const module = (await import(/* @vite-ignore */ entryUrl)) as Record<string, unknown>
    const result: RunResult = runTests({ ...module }, tests, { onCheckStart: capture.setCheck, logs: capture.entries })
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
