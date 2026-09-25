import { describe, expect, it } from 'vitest'

import { ContentError, parseFrontmatter, requireString, splitSections } from './parse'

describe('parseFrontmatter', () => {
  it('splits frontmatter from body', () => {
    const { data, body } = parseFrontmatter('---\ntitle: Hi\n---\nSome prose.', 'x.md')
    expect(data.title).toBe('Hi')
    expect(body).toBe('Some prose.')
  })

  it('names the file when frontmatter is missing', () => {
    expect(() => parseFrontmatter('no frontmatter', 'lesson.md')).toThrow(ContentError)
    expect(() => parseFrontmatter('no frontmatter', 'lesson.md')).toThrow(/lesson\.md/)
  })

  it('names the file when the YAML is malformed', () => {
    expect(() => parseFrontmatter('---\na: [1,\n---\nx', 'bad.md')).toThrow(/bad\.md/)
  })

  it('keeps a body containing --- inside a fence', () => {
    const { body } = parseFrontmatter('---\ntitle: X\n---\n```\n---\n```', 'x.md')
    expect(body).toContain('---')
  })
})

describe('splitSections', () => {
  const body = [
    'Intro prose.',
    '',
    '## file a.js',
    '',
    '```javascript',
    'export const a = 1',
    '```',
    '',
    '## explanation',
    '',
    'Why it works.',
    '',
    '## check adds up',
    '',
    'The description.',
    '',
    '```javascript',
    'assert.strictEqual(a, 1)',
    '```',
  ].join('\n')

  const { intro, blocks } = splitSections(body)

  it('keeps prose before the first heading as the intro', () => {
    expect(intro).toBe('Intro prose.')
  })

  it('finds every heading', () => {
    expect(blocks.map(b => b.heading)).toEqual(['file a.js', 'explanation', 'check adds up'])
  })

  it('captures fenced code', () => {
    expect(blocks[0]?.code).toBe('export const a = 1')
    expect(blocks[0]?.language).toBe('javascript')
  })

  it('captures prose for a block with no fence', () => {
    expect(blocks[1]?.prose).toBe('Why it works.')
    expect(blocks[1]?.code).toBe('')
  })

  it('captures prose and code together', () => {
    expect(blocks[2]?.prose).toBe('The description.')
    expect(blocks[2]?.code).toBe('assert.strictEqual(a, 1)')
  })

  it('does not treat a ## inside a fence as a heading', () => {
    const { blocks: only } = splitSections('## one\n\n```\n## not a heading\n```')
    expect(only).toHaveLength(1)
    expect(only[0]?.code).toBe('## not a heading')
  })

  it('handles a body with no headings', () => {
    expect(splitSections('just prose').blocks).toEqual([])
  })

  it('keeps a fence in the intro as part of the intro', () => {
    const split = splitSections(
      'Shape:\n\n```javascript\n{ a: 1 }\n```\n\nThen.\n\n## file a.js\n\n```javascript\nstarter\n```',
    )
    expect(split.intro).toBe('Shape:\n\n```javascript\n{ a: 1 }\n```\n\nThen.')
    expect(split.blocks[0]?.code).toBe('starter')
    expect(split.blocks[0]?.language).toBe('javascript')
  })

  it('does not treat a ## inside an intro fence as a heading', () => {
    const split = splitSections('```\n## not a heading\n```\n\n## one')
    expect(split.intro).toBe('```\n## not a heading\n```')
    expect(split.blocks.map(b => b.heading)).toEqual(['one'])
  })
})

describe('requireString', () => {
  it('returns the value', () => {
    expect(requireString({ a: 'x' }, 'a', 'f.md')).toBe('x')
  })

  it('rejects missing, empty and non-string values', () => {
    expect(() => requireString({}, 'a', 'f.md')).toThrow(/f\.md.*"a"/)
    expect(() => requireString({ a: '  ' }, 'a', 'f.md')).toThrow(ContentError)
    expect(() => requireString({ a: 3 }, 'a', 'f.md')).toThrow(ContentError)
  })
})
