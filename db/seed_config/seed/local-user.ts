/**
 * The single local user.
 *
 * learnit runs locally for one person, so there is no auth and no user
 * directory. One seeded user stands in for the signed-in student everywhere
 * the UI needs one.
 */
export const localUser = {
  first_name: 'Mike',
  last_name: 'Earley',
  email: 'mike@localhost',
  role: 'app_admin' as const,
}

/**
 * Where that user is up to.
 *
 * Positions are expressed as chapter and section numbers rather than IDs,
 * because IDs are derived by the seeder. `completed` lists finished sections;
 * `current` is where the student resumes.
 */
export const localProgress = {
  'javascript-fundamentals': {
    completed: [
      { chapter: 1, section: 1 },
      { chapter: 1, section: 2 },
    ],
    current: { chapter: 1, section: 3 },
    /** Attempts against the one authored exercise. */
    exercises: [{ chapter: 1, section: 2, attempts: 3, score: 80, completed: true }],
  },
  'python-fundamentals': {
    completed: [],
    current: { chapter: 1, section: 1 },
    exercises: [],
  },
}
