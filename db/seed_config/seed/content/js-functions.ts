import type { ExerciseConfig } from '../../types/seed-types'

/**
 * Authored content for JavaScript Fundamentals, chapter 2.
 *
 * The exercise here deliberately spans two files so the workspace and the
 * module linker are exercised by real seed data rather than a fixture.
 */

export const functionsLesson = {
  markdown: `## Functions give a name to a job

A function packages up a piece of work so you can run it whenever you like, with different
inputs each time.

\`\`\`javascript
function double(n) {
  return n * 2
}

double(4) // 8
\`\`\`

The value after \`return\` is what the caller gets back. A function with no \`return\` gives back
\`undefined\`.

## Arrow functions

The same function, written as an arrow:

\`\`\`javascript
const double = n => n * 2
\`\`\`

When the body is a single expression, the result is returned without writing \`return\`. Reach for
the longer form as soon as the body needs more than one line.

## Default parameters

A parameter can carry a fallback for when the caller leaves it out.

\`\`\`javascript
const greet = (name = 'friend') => \`Hello, \${name}\`

greet()        // "Hello, friend"
greet('Ada')   // "Hello, Ada"
\`\`\`

## Objects bundle data with behaviour

An object groups related values under names, and its methods are functions stored on it.

\`\`\`javascript
const course = {
  title: 'JavaScript Fundamentals',
  lessons: 12,
  describe() {
    return \`\${this.title} has \${this.lessons} lessons\`
  },
}
\`\`\`

Inside \`describe\`, \`this\` refers to the object the method was called on. That is the one piece of
JavaScript that reliably surprises people, and it is worth being suspicious of \`this\` whenever a
method gets passed around rather than called directly.

## Splitting code across files

A real project spreads functions across files. One file exports, another imports:

\`\`\`javascript
// format.js
export const percent = (part, whole) => Math.round((part / whole) * 100)

// progress.js
import { percent } from './format.js'
\`\`\`

The exercise in the next section does exactly this.`,
  references: [
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions',
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this',
  ],
}

export const functionsRecap = {
  summary:
    'Functions name a job so it can run repeatedly with different inputs. Objects group related ' +
    'values, and methods are functions stored on them. Modules let one file use functions defined ' +
    'in another.',
  key_points: [
    'A function returns the value after `return`, or `undefined` if there is none.',
    'Arrow functions with a single expression body return it without writing `return`.',
    'A default parameter supplies a fallback when the caller omits an argument.',
    'Inside a method, `this` is the object the method was called on.',
    'Be suspicious of `this` whenever a method is passed around instead of called directly.',
    '`export` makes a binding available to other files; `import` brings it in.',
    'Relative import paths start with `./` and name a file, not a package.',
  ],
}

export const progressExercise: ExerciseConfig = {
  seedSequence: 1,
  exercise_display_number: 1,
  estimated_time_minutes: 20,
  difficulty: 'medium',
  instructions: `Build a progress summary across two files.

**format.js** (already written, read only) gives you \`percent(part, whole)\` and \`pluralise(count, word)\`.

In **progress.js**:

1. Import both helpers from \`./format.js\`.
2. Export \`summarise(completed, total)\` returning, for 3 of 12:

   \`3 of 12 lessons complete (25%)\`

   Use \`pluralise\` so 1 of 12 reads \`1 of 12 lessons complete\` but the word is \`lesson\` when
   \`completed\` is 1.
3. Export \`isFinished(completed, total)\`, true only when \`total\` is above zero and everything is done.
4. Guard against \`total\` being zero: \`summarise(0, 0)\` must return \`Nothing to do yet\` rather than
   dividing by zero.`,
  browser_html: {
    files: [
      {
        filename: 'index.html',
        content: '<main id="app">\n  <h1>Course progress</h1>\n  <p id="output"></p>\n</main>',
        isHidden: false,
      },
    ],
    defaultView: 'index.html',
  },
  code_files: {
    files: [
      {
        filename: 'format.js',
        language: 'javascript',
        content: `// Helpers for progress.js. You do not need to change this file.

export const percent = (part, whole) => Math.round((part / whole) * 100)

export const pluralise = (count, word) => (count === 1 ? word : word + 's')
`,
        isReadOnly: true,
        isHidden: false,
      },
      {
        filename: 'progress.js',
        language: 'javascript',
        content: `// 1. Import percent and pluralise from ./format.js


// 2. Return "3 of 12 lessons complete (25%)".
// 4. Return "Nothing to do yet" when total is 0.
export function summarise(completed, total) {
  return ''
}

// 3. True only when total is above zero and every lesson is done.
export function isFinished(completed, total) {
  return false
}
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'progress.js',
  },
  tests: {
    tests: [
      {
        name: 'summarise formats a partly finished course',
        description: 'Three of twelve lessons should read "3 of 12 lessons complete (25%)".',
        testFunction: "assert.strictEqual(summarise(3, 12), '3 of 12 lessons complete (25%)')",
        expectedOutput: '3 of 12 lessons complete (25%)',
      },
      {
        name: 'summarise uses the singular for one lesson',
        description: 'One completed lesson should say "lesson", not "lessons".',
        testFunction: "assert.strictEqual(summarise(1, 12), '1 of 12 lessons complete (8%)')",
        expectedOutput: '1 of 12 lessons complete (8%)',
      },
      {
        name: 'summarise handles an empty course',
        description: 'A total of zero must not divide by zero.',
        testFunction: "assert.strictEqual(summarise(0, 0), 'Nothing to do yet')",
        expectedOutput: 'Nothing to do yet',
      },
      {
        name: 'isFinished is true only when everything is done',
        description: 'Every lesson complete, and at least one lesson to complete.',
        testFunction: 'assert.strictEqual(isFinished(12, 12), true); assert.strictEqual(isFinished(11, 12), false)',
        expectedOutput: true,
      },
      {
        name: 'isFinished is false for an empty course',
        description: 'Zero of zero is not finished; there was nothing to finish.',
        testFunction: 'assert.strictEqual(isFinished(0, 0), false)',
        expectedOutput: false,
      },
    ],
  },
  hints: {
    hints: [
      {
        order: 1,
        type: 'code',
        content: "import { percent, pluralise } from './format.js'",
        showAfterAttempts: 1,
      },
      {
        order: 2,
        type: 'text',
        content: 'Handle the total-of-zero case first and return early, before any arithmetic.',
        showAfterAttempts: 2,
      },
      {
        order: 3,
        type: 'text',
        content: 'The word that changes is the one after the count of total lessons, not completed ones.',
        showAfterAttempts: 3,
      },
      {
        order: 4,
        type: 'text',
        content: 'isFinished needs two conditions joined with &&, not just an equality check.',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `import { percent, pluralise } from './format.js'

export function summarise(completed, total) {
  if (total === 0) return 'Nothing to do yet'
  return \`\${completed} of \${total} \${pluralise(total, 'lesson')} complete (\${percent(completed, total)}%)\`
}

export function isFinished(completed, total) {
  return total > 0 && completed >= total
}
`,
    explanation:
      'The zero case returns early, so percent never divides by zero. pluralise is called with total ' +
      'rather than completed, because the phrase counts the lessons in the course. isFinished needs ' +
      'both conditions: without the total check, an empty course would report itself as finished.',
  },
  student_solution: {
    content: '',
    explanation: '',
  },
}
