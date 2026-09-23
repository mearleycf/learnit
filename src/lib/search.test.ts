import { contentText, snippetAround } from '@utils/search'
import { describe, expect, it } from 'vitest'

describe('snippetAround', () => {
  it('centres the snippet on the match', () => {
    const text = `${'a'.repeat(200)} needle ${'b'.repeat(200)}`
    const snippet = snippetAround(text, 'needle')
    expect(snippet).toContain('needle')
    expect(snippet.startsWith('…')).toBe(true)
    expect(snippet.endsWith('…')).toBe(true)
  })

  it('does not add an ellipsis when the match is at the start', () => {
    expect(snippetAround('needle in a haystack', 'needle')).toBe('needle in a haystack')
  })

  it('collapses whitespace', () => {
    expect(snippetAround('one\n\n  two', 'two')).toBe('one two')
  })

  it('falls back to the head of the text when the term is absent', () => {
    expect(snippetAround('some description here', 'zzz')).toBe('some description here')
  })

  it('matches case-insensitively', () => {
    expect(snippetAround('The Needle', 'needle')).toContain('Needle')
  })
})

describe('contentText', () => {
  it('reads a lesson body', () => {
    expect(contentText({ content_type: 'lesson', lesson: { markdown: '# Hi there' } })).toBe('# Hi there')
  })

  it('joins a recap summary and its key points', () => {
    const text = contentText({
      content_type: 'recap',
      recap: { summary: 'Summary line', key_points: ['first', 'second'] },
    })
    expect(text).toBe('Summary line first second')
  })

  it('returns nothing for an exercise, which has no prose', () => {
    expect(contentText({ content_type: 'exercise' })).toBe('')
  })

  it('returns nothing for unauthored or malformed content', () => {
    expect(contentText(null)).toBe('')
    expect(contentText({ content_type: 'video' })).toBe('')
    expect(contentText({})).toBe('')
  })

  it('handles a lesson whose body is not written yet', () => {
    expect(contentText({ content_type: 'lesson' })).toBe('')
  })
})
