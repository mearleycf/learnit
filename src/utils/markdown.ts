import { createMarkdownProcessor } from '@astrojs/markdown-remark'
import rehypeSanitize from 'rehype-sanitize'

/**
 * Two markdown processors, split by who wrote the source.
 *
 * Astro's processor does not sanitise. Raw HTML in markdown, including
 * `<script>` and `onerror`, passes through untouched. That is fine for
 * anything committed to this repo, and not fine for anything typed into a
 * form, so the two go through different processors.
 *
 * Each is built once per server process; creating one per render is
 * measurable when a page renders a list of notes.
 */

/** For content authored in the repo: lessons, recaps, exercise instructions. */
let authored: Awaited<ReturnType<typeof createMarkdownProcessor>> | null = null

/** For content typed at runtime: notes, feedback. */
let untrusted: Awaited<ReturnType<typeof createMarkdownProcessor>> | null = null

const authoredProcessor = async () => {
  authored ??= await createMarkdownProcessor({})
  return authored
}

const untrustedProcessor = async () => {
  untrusted ??= await createMarkdownProcessor({ rehypePlugins: [rehypeSanitize] })
  return untrusted
}

/**
 * Renders markdown written in this repo.
 *
 * Trusted, so raw HTML survives. Never pass anything a form produced.
 */
export const renderAuthored = async (source: string): Promise<string> => {
  const { code } = await (await authoredProcessor()).render(source)
  return code
}

/**
 * Renders markdown someone typed into the app.
 *
 * Scripts, event handlers and unknown elements are stripped. Today Mike is
 * the only author, so this changes nothing he would notice; it means the
 * boundary is enforced in code rather than remembered.
 */
export const renderUserInput = async (source: string): Promise<string> => {
  const { code } = await (await untrustedProcessor()).render(source)
  return code
}

/** Renders several user-authored sources in one pass, keeping input order. */
export const renderAllUserInput = async (sources: string[]): Promise<string[]> =>
  Promise.all(sources.map(renderUserInput))

/**
 * Tailwind classes for rendered markdown.
 *
 * Kept here so lesson bodies, notes and anywhere else that renders prose stay
 * visually consistent. `compact` drops the larger heading treatment for short
 * bodies such as a note.
 */
export const PROSE_CLASSES =
  '[&_code]:bg-(--color-raised) [&_code]:rounded [&_code]:px-1 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold ' +
  '[&_li]:ml-5 [&_li]:list-disc [&_p]:mt-4 [&_pre]:bg-night-raised [&_pre]:mt-4 [&_pre]:overflow-x-auto ' +
  '[&_pre]:rounded-lg [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:text-parchment [&_ul]:mt-4'

export const PROSE_COMPACT =
  '[&_code]:bg-(--color-raised) [&_code]:rounded [&_code]:px-1 [&_li]:ml-5 [&_li]:list-disc ' +
  '[&_p]:mt-2 [&_p:first-child]:mt-0 [&_pre]:bg-night-raised [&_pre]:mt-2 [&_pre]:overflow-x-auto ' +
  '[&_pre]:rounded [&_pre]:p-3 [&_pre]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:text-parchment [&_ul]:mt-2'
