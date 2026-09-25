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
    completed: [{ chapter: 1, section: 1 }],
    current: { chapter: 1, section: 2 },
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
    quote: 'a bug from 1995 that cannot be fixed without breaking the web',
    markdown: 'So the null check has to come first, always. `value === null` before anything else.',
  },
  {
    course: 'javascript-fundamentals',
    chapter: 1,
    section: 1,
    markdown:
      'Check whether `Object.prototype.toString.call` is worth it anywhere in my own code, or just library code.',
  },
  {
    course: 'javascript-fundamentals',
    chapter: 1,
    section: 2,
    quote: 'Number.isNaN(NaN)',
    markdown: 'The global `isNaN` coerces first, so `isNaN("abc")` is true. `Number.isNaN` does not. Use the latter.',
  },
]

/**
 * Feedback reports, one per status.
 *
 * Deliberately covers every status and most categories, so the triage UI has
 * a real example of each state to render rather than one happy path.
 */
export const localFeedback = [
  {
    course: 'javascript-fundamentals',
    chapter: 1,
    section: 1,
    status: 'submitted' as const,
    category: 'typo_or_grammar' as const,
    markdown: 'The arrow comments in the first code block line up in the editor but not in the rendered page.',
    rating: 4,
  },
  {
    course: 'javascript-fundamentals',
    chapter: 1,
    section: 1,
    status: 'assigned' as const,
    category: 'clarity_improvement' as const,
    markdown: 'Worth saying why `typeof` reports "function", given functions are objects. The aside is easy to miss.',
    rating: 3,
    assigned: true,
  },
  {
    course: 'javascript-fundamentals',
    chapter: 1,
    section: 2,
    status: 'in_progress' as const,
    category: 'incorrect_content' as const,
    markdown:
      'The `toNumber` check expects null for an empty string, but the instructions only mention `Number("")` being 0.',
    rating: 2,
    assigned: true,
    adminNotes: 'Fair. The instruction should state the return contract, not just the surprise.',
  },
  {
    course: 'javascript-fundamentals',
    chapter: 1,
    section: 2,
    status: 'pending_publication' as const,
    category: 'feature_request' as const,
    markdown: 'It would help to see which check failed rather than just a count.',
    assigned: true,
    adminNotes: 'Fix written, waiting on the exercise runner to ship.',
    github: 'https://github.com/mearleycf/learnit/issues/141',
  },
  {
    course: 'python-fundamentals',
    chapter: 1,
    section: 1,
    status: 'resolved' as const,
    category: 'technical_issue' as const,
    markdown: 'The first Python run sat on "starting" for about eight seconds with no indication it was alive.',
    rating: 5,
    assigned: true,
    adminNotes: 'Pyodide boot. Fixed by showing the runtime-loading state instead of a bare spinner.',
  },
  {
    course: 'python-fundamentals',
    chapter: 1,
    section: 6,
    status: 'no_action_required' as const,
    category: 'general_feedback' as const,
    markdown: 'Could the recap come before the exercises instead of after?',
    rating: 4,
    adminNotes: 'Recap after the exercises is deliberate: it summarises what they just taught.',
  },
]
