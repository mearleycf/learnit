import { SEED_EPOCH, seedDate, seededRandom, seedUlid } from '@db/seed_config/seed/deterministic'
import { describe, expect, it } from 'vitest'

const ULID_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/

describe('seedUlid', () => {
  it('is stable for the same key', () => {
    expect(seedUlid('course:javascript-fundamentals')).toBe(seedUlid('course:javascript-fundamentals'))
  })

  it('differs for different keys', () => {
    expect(seedUlid('course:a')).not.toBe(seedUlid('course:b'))
  })

  it('produces a valid ULID', () => {
    expect(seedUlid('course:javascript-fundamentals')).toMatch(ULID_PATTERN)
    expect(seedUlid('x', new Date('2020-06-15T12:00:00Z'))).toMatch(ULID_PATTERN)
  })
})

describe('seededRandom', () => {
  it('replays the same sequence for the same key', () => {
    const a = seededRandom('k')
    const b = seededRandom('k')
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })

  it('stays within [0, 1)', () => {
    const rng = seededRandom('range')
    for (let i = 0; i < 500; i += 1) {
      const n = rng()
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThan(1)
    }
  })
})

describe('seedDate', () => {
  it('is stable for the same key', () => {
    expect(seedDate('c', -100, -10).getTime()).toBe(seedDate('c', -100, -10).getTime())
  })

  it('stays inside the requested window', () => {
    const day = 24 * 60 * 60 * 1000
    for (const key of ['a', 'b', 'c', 'd', 'e']) {
      const d = seedDate(key, -200, -5).getTime()
      expect(d).toBeGreaterThanOrEqual(SEED_EPOCH.getTime() - 200 * day)
      expect(d).toBeLessThanOrEqual(SEED_EPOCH.getTime() - 5 * day)
    }
  })
})
