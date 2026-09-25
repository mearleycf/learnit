import type { LogLevel } from './capture'
import type { SourceFile } from './link'

/**
 * Messages exchanged with the preview frame.
 *
 * The preview is a same-origin route rather than a `srcdoc` sandbox, so it can
 * import the real module linker instead of carrying a copy. The isolation that
 * matters here is that a student's DOM code cannot disturb the page around it,
 * which an iframe gives either way.
 */

export const PREVIEW_ROUTE = '/exercise-preview'

/** Sent by the parent to render a run. */
export type RenderMessage = {
  source: 'learnit-preview'
  type: 'render'
  /** Markup placed inside the frame's body before the code runs. */
  html: string
  files: SourceFile[]
  entry: string
}

/** Sent by the frame as the student's code runs. */
export type PreviewMessage =
  | { source: 'learnit-preview'; type: 'ready' }
  | { source: 'learnit-preview'; type: 'log'; level: LogLevel; text: string }
  | { source: 'learnit-preview'; type: 'error'; text: string }
  | { source: 'learnit-preview'; type: 'done' }

export const isPreviewMessage = (value: unknown): value is PreviewMessage =>
  typeof value === 'object' &&
  value !== null &&
  (value as { source?: unknown }).source === 'learnit-preview' &&
  typeof (value as { type?: unknown }).type === 'string'

export const isRenderMessage = (value: unknown): value is RenderMessage =>
  isPreviewMessage(value) && (value as { type: string }).type === 'render'
