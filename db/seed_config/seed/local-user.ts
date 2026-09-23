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
    markdown: 'The sentence about semicolons reads oddly. "JavaScript inserts them for you" could use a comma.',
    rating: 4,
  },
  {
    course: 'javascript-fundamentals',
    chapter: 1,
    section: 1,
    status: 'assigned' as const,
    category: 'clarity_improvement' as const,
    markdown: 'Worth saying explicitly that the console is opened with the browser dev tools, not the terminal.',
    rating: 3,
    assigned: true,
  },
  {
    course: 'javascript-fundamentals',
    chapter: 1,
    section: 2,
    status: 'in_progress' as const,
    category: 'incorrect_content' as const,
    markdown: 'The fifth check calls describeProgress(false), but the starter signature takes no arguments.',
    rating: 2,
    assigned: true,
    adminNotes: 'Real bug. Either the starter takes an optional parameter or the check should set isEnrolled.',
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
    course: 'javascript-fundamentals',
    chapter: 1,
    section: 3,
    status: 'resolved' as const,
    category: 'technical_issue' as const,
    markdown: 'The recap key points were rendering as one run-on paragraph.',
    rating: 5,
    assigned: true,
    adminNotes: 'Fixed when the recap moved to a real list.',
  },
  {
    course: 'javascript-fundamentals',
    chapter: 1,
    section: 3,
    status: 'no_action_required' as const,
    category: 'general_feedback' as const,
    markdown: 'Could the recap come before the exercise instead of after?',
    rating: 4,
    adminNotes: 'Recap after the exercise is deliberate: it summarises what the exercise just taught.',
  },
]
