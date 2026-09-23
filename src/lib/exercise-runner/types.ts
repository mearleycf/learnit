/** A single check, as authored in the exercise seed data. */
export type TestCase = {
  name: string
  description: string
  /** JavaScript evaluated with the student's exports and `assert` in scope. */
  testFunction: string
  timeout?: number
}

export type TestOutcome = {
  name: string
  description: string
  passed: boolean
  /** Failure message, or null when the check passed. */
  message: string | null
}

export type RunResult = {
  outcomes: TestOutcome[]
  passed: number
  total: number
  /** Set when the student's code failed to load at all, which skips the checks. */
  loadError: string | null
}
