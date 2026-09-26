import { parse as parseYaml } from 'yaml'

/**
 * Parses a section file: YAML frontmatter plus a markdown body.
 *
 * Content lives as markdown on disk rather than TypeScript literals. At the
 * scale these courses are heading for, a backtick or a `${` in a code sample
 * terminating its enclosing template literal is a constant hazard, and
 * markdown has no such trap.
 */

export class ContentError extends Error {
  override name = 'ContentError'
}

export type Parsed = { data: Record<string, unknown>; body: string }

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

/** Splits frontmatter from body. A file without frontmatter is an error, not a default. */
export const parseFrontmatter = (source: string, path: string): Parsed => {
  const match = FRONTMATTER.exec(source)
  if (!match) throw new ContentError(`${path}: no frontmatter`)

  let data: unknown
  try {
    data = parseYaml(match[1] ?? '')
  } catch (error) {
    throw new ContentError(`${path}: invalid frontmatter: ${(error as Error).message}`)
  }

  if (typeof data !== 'object' || data === null) throw new ContentError(`${path}: frontmatter is not a mapping`)
  return { data: data as Record<string, unknown>, body: (match[2] ?? '').trim() }
}

export type NamedBlock = {
  heading: string
  /** Prose under the heading, before any fence. */
  prose: string
  /** Contents of the first fenced block under the heading. */
  code: string
  language: string | null
}

/**
 * Splits a body into the prose before the first `## heading`, and a block per
 * heading carrying both its prose and its first fenced code block.
 *
 * Everything an exercise needs lives here rather than in frontmatter: starter
 * files, the solution, each check and each hint. YAML cannot hold JavaScript
 * safely, since `() => {}` parses as a flow mapping and a colon in a string
 * ends the key. Markdown has no such hazards.
 */
export const splitSections = (body: string): { intro: string; blocks: NamedBlock[] } => {
  const lines = body.split('\n')
  const blocks: NamedBlock[] = []
  const intro: string[] = []

  let heading: string | null = null
  let fence: string | null = null
  let language: string | null = null
  let seenFence = false
  let capturing = false
  let code: string[] = []
  let prose: string[] = []

  const flush = () => {
    if (heading === null) return
    blocks.push({ heading, language, code: code.join('\n'), prose: prose.join('\n').trim() })
    language = null
    seenFence = false
    capturing = false
    code = []
    prose = []
  }

  for (const line of lines) {
    const fenceMatch = /^```(\w*)\s*$/.exec(line)

    // The intro is prose rendered as markdown, so a fence there is an example
    // to keep verbatim, not a block's code. Tracking it still stops a `##`
    // inside it from reading as a heading.
    if (heading === null && (fence !== null || fenceMatch)) {
      intro.push(line)
      if (fence === null) fence = '```'
      else if (line.trimEnd() === fence) fence = null
      continue
    }

    if (fence !== null) {
      if (line.trimEnd() === fence) {
        fence = null
        capturing = false
      } else if (capturing) {
        code.push(line)
      }
      continue
    }

    if (fenceMatch) {
      fence = '```'
      // Only the first fence under a heading is the block's code; later ones
      // are examples inside prose and are dropped rather than appended.
      capturing = !seenFence
      if (!seenFence) {
        seenFence = true
        language = fenceMatch[1] || null
      }
      continue
    }

    const headingMatch = /^##\s+(.+?)\s*$/.exec(line)
    if (headingMatch) {
      flush()
      heading = headingMatch[1] ?? ''
      continue
    }

    if (heading === null) intro.push(line)
    else prose.push(line)
  }

  flush()
  return { intro: intro.join('\n').trim(), blocks }
}

/** Reads a required string from frontmatter, failing loudly rather than defaulting. */
export const requireString = (data: Record<string, unknown>, key: string, path: string): string => {
  const value = data[key]
  if (typeof value !== 'string' || value.trim() === '') throw new ContentError(`${path}: missing "${key}"`)
  return value
}

export const optionalString = (data: Record<string, unknown>, key: string): string | undefined => {
  const value = data[key]
  return typeof value === 'string' ? value : undefined
}

export const optionalNumber = (data: Record<string, unknown>, key: string): number | undefined => {
  const value = data[key]
  return typeof value === 'number' ? value : undefined
}
