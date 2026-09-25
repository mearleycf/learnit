import { createHash } from 'node:crypto'

/**
 * Deterministic primitives for seeding.
 *
 * Seed data exists to build and test the front end against, so every run must
 * produce byte-identical rows. Previously each run called `ulid()` and
 * `Math.random()`, so IDs and timestamps changed every time. That makes it
 * impossible to link to a fixture, assert on one in a test, or compare
 * screenshots between runs.
 *
 * Everything here is derived from a string key, so the same key always yields
 * the same value, and different keys yield well-distributed different values.
 */

/** Crockford base32, the ULID alphabet. Excludes I, L, O and U. */
const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

/** Fixed clock for all seeded timestamps, so dates never drift with the calendar. */
export const SEED_EPOCH = new Date('2026-01-01T00:00:00.000Z')

const digest = (key: string): Buffer => createHash('sha256').update(key).digest()

/**
 * Returns a deterministic 32-bit PRNG for the given key.
 *
 * mulberry32: small, fast, and good enough for spreading fixture values.
 */
export const seededRandom = (key: string): (() => number) => {
  let a = digest(key).readUInt32BE(0)
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const encodeTime = (ms: number): string => {
  let out = ''
  let remaining = ms
  for (let i = 0; i < 10; i += 1) {
    out = CROCKFORD[remaining % 32] + out
    remaining = Math.floor(remaining / 32)
  }
  return out
}

/**
 * Builds a syntactically valid ULID that is stable for a given key.
 *
 * The 10-character time prefix comes from `date`, and the 16 characters of
 * entropy are derived from the key's hash rather than from a random source.
 */
export const seedUlid = (key: string, date: Date = SEED_EPOCH): string => {
  const hash = digest(key)
  let entropy = ''
  for (let i = 0; i < 16; i += 1) {
    entropy += CROCKFORD[hash[i]! % 32]
  }
  return encodeTime(date.getTime()) + entropy
}

/**
 * Picks a stable date for `key` within `daysBefore`..`daysAfter` of SEED_EPOCH.
 *
 * Negative offsets are in the past. Resolution is whole minutes, which keeps
 * the values readable without making collisions likely.
 */
export const seedDate = (key: string, daysBefore: number, daysAfter: number): Date => {
  const rng = seededRandom(`date:${key}`)
  const span = (daysAfter - daysBefore) * 24 * 60
  const minutes = Math.floor(rng() * span) + daysBefore * 24 * 60
  return new Date(SEED_EPOCH.getTime() + minutes * 60_000)
}
