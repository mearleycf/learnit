import { createPrecisionScaleRefinement, jsonSerializableSchema } from '@utils/general_utils'
import { describe, expect, it } from 'vitest'

import { courseSchema } from './courses.schema'
import { sectionContentSchema } from './sections.schema'
import { userSchema } from './users.schema'

const ULID = '01ARZ3NDEKTSV4RRFFQ69G5FAV'

describe('sectionContentSchema', () => {
  it('accepts a lesson payload under the lesson key', () => {
    const result = sectionContentSchema.safeParse({
      content_type: 'lesson',
      lesson: { markdown: '# Intro', references: ['mdn'] },
    })
    expect(result.success).toBe(true)
  })

  it('accepts a section whose payload has not been authored yet', () => {
    expect(sectionContentSchema.safeParse({ content_type: 'lesson' }).success).toBe(true)
    expect(sectionContentSchema.safeParse({ content_type: 'exercise' }).success).toBe(true)
  })

  it('rejects an unknown content type', () => {
    expect(sectionContentSchema.safeParse({ content_type: 'video' }).success).toBe(false)
  })
})

describe('courseSchema', () => {
  const base = {
    id: ULID,
    title: 'JavaScript Fundamentals',
    description: 'Learn the fundamentals',
    slug: 'javascript-fundamentals',
    subject_area: 'Programming',
    level: 'beginner' as const,
    tags: ['javascript'],
    created_at: new Date(),
    updated_at: new Date(),
  }

  it('accepts a well-formed course', () => {
    expect(courseSchema.safeParse({ ...base, price: 49.99 }).success).toBe(true)
  })

  it('rejects a price exceeding scale 2', () => {
    expect(courseSchema.safeParse({ ...base, price: 49.999 }).success).toBe(false)
  })

  it('rejects a title shorter than four characters', () => {
    expect(courseSchema.safeParse({ ...base, title: 'JS' }).success).toBe(false)
  })
})

describe('userSchema', () => {
  it('rejects a malformed email', () => {
    const result = userSchema.safeParse({
      id: ULID,
      first_name: 'Ada',
      last_name: 'Lovelace',
      email: 'not-an-email',
      role: 'student',
      created_at: new Date(),
      updated_at: new Date(),
    })
    expect(result.success).toBe(false)
  })
})

describe('createPrecisionScaleRefinement', () => {
  const refine = createPrecisionScaleRefinement(10, 2)

  it('passes values within precision and scale', () => {
    expect(refine(49.99)).toBe(true)
    expect(refine(12345678.12)).toBe(true)
  })

  it('fails values with too many decimal places', () => {
    expect(refine(1.234)).toBe(false)
  })

  it('treats null and undefined as valid', () => {
    expect(refine(null)).toBe(true)
    expect(refine(undefined)).toBe(true)
  })
})

describe('jsonSerializableSchema', () => {
  it('accepts plain data', () => {
    expect(jsonSerializableSchema.safeParse({ a: [1, 'two'] }).success).toBe(true)
  })

  it('rejects a circular structure', () => {
    const circular: Record<string, unknown> = {}
    circular.self = circular
    expect(jsonSerializableSchema.safeParse(circular).success).toBe(false)
  })
})
