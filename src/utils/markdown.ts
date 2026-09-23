import { createMarkdownProcessor } from '@astrojs/markdown-remark'

/**
 * Shared markdown processor.
 *
 * Built once per server process. Creating one per render is measurable when a
 * page renders a list of notes.
 */
let processor: Awaited<ReturnType<typeof createMarkdownProcessor>> | null = null

const getProcessor = async () => {
  processor ??= await createMarkdownProcessor({})
  return processor
}

export const renderMarkdown = async (source: string): Promise<string> => {
  const { code } = await (await getProcessor()).render(source)
  return code
}

/** Renders several sources in one pass, keeping the input order. */
export const renderAll = async (sources: string[]): Promise<string[]> => Promise.all(sources.map(renderMarkdown))

/**
 * Tailwind classes for rendered markdown.
 *
 * Kept here so the lesson body, notes and anywhere else that renders prose
 * stay visually consistent. `compact` drops the larger heading treatment for
 * short bodies such as a note.
 */
export const PROSE_CLASSES =
  '[&_code]:bg-(--color-raised) [&_code]:rounded [&_code]:px-1 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold ' +
  '[&_li]:ml-5 [&_li]:list-disc [&_p]:mt-4 [&_pre]:bg-night-raised [&_pre]:mt-4 [&_pre]:overflow-x-auto ' +
  '[&_pre]:rounded-lg [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:text-parchment [&_ul]:mt-4'

export const PROSE_COMPACT =
  '[&_code]:bg-(--color-raised) [&_code]:rounded [&_code]:px-1 [&_li]:ml-5 [&_li]:list-disc ' +
  '[&_p]:mt-2 [&_p:first-child]:mt-0 [&_pre]:bg-night-raised [&_pre]:mt-2 [&_pre]:overflow-x-auto ' +
  '[&_pre]:rounded [&_pre]:p-3 [&_pre]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:text-parchment [&_ul]:mt-2'
