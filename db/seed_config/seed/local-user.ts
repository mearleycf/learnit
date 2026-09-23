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

/**
 * Notes the local student has taken.
 *
 * Positions are chapter and section numbers; the seeder resolves them to IDs.
 * `quote` anchors a note to a passage of the lesson, and is omitted for a
 * free-standing note.
 */
export const localNotes = [
  {
    course: 'javascript-fundamentals',
    chapter: 1,
    section: 1,
    quote: 'The engine reads your program top to bottom and does what it says.',
    markdown: 'Worth remembering: nothing runs in parallel here. Ordering bugs are usually my own.',
  },
  {
    course: 'javascript-fundamentals',
    chapter: 1,
    section: 1,
    markdown: 'Check whether `console.log` survives into production builds, or whether it gets stripped.',
  },
  {
    course: 'javascript-fundamentals',
    chapter: 1,
    section: 3,
    quote: 'Prefer const by default and reach for let only when you need to reassign.',
    markdown: 'This is the rule I keep breaking. `const` first, then loosen it only when the reassign is real.',
  },
]
