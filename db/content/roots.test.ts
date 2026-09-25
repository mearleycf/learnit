// @vitest-environment node
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { loadCourses } from './load'

const real = await loadCourses(resolve(process.cwd(), 'content'))
const fixtures = await loadCourses(resolve(process.cwd(), 'tests/fixtures/content'))

describe('content roots', () => {
  it('keeps the e2e fixture course out of content/', () => {
    expect(real.map(course => course.slug)).not.toContain('e2e-fixtures')
    expect(fixtures.map(course => course.slug)).toEqual(['e2e-fixtures'])
  })

  it('gives fixture courses slugs no real course uses', () => {
    const realSlugs = new Set(real.map(course => course.slug))
    expect(fixtures.filter(course => realSlugs.has(course.slug))).toEqual([])
  })
})
