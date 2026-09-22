import { describe, expect, it } from 'vitest'

import { resolveContent } from './seed'

describe('resolveContent', () => {
  it('treats an empty object as unauthored', () => {
    expect(resolveContent({}, 'x')).toBeNull()
  })

  it('treats null and undefined as unauthored', () => {
    expect(resolveContent(null, 'x')).toBeNull()
    expect(resolveContent(undefined, 'x')).toBeNull()
  })

  it('accepts a valid lesson payload', () => {
    const payload = { content_type: 'lesson', lesson: { markdown: '# Hi' } }
    expect(resolveContent(payload, 'x')).toEqual(payload)
  })

  it('accepts a valid recap payload', () => {
    const payload = { content_type: 'recap', recap: { summary: 's', key_points: ['a'] } }
    expect(resolveContent(payload, 'x')).toEqual(payload)
  })

  it('rejects an unknown content type and names the section', () => {
    expect(() => resolveContent({ content_type: 'video' }, 'Intro (course:x:section:1)')).toThrow(
      /Intro \(course:x:section:1\)/,
    )
  })

  it('rejects a lesson whose payload is malformed', () => {
    expect(() => resolveContent({ content_type: 'lesson', lesson: { markdown: 42 } }, 'x')).toThrow(/Invalid/)
  })
})
