import type { ExerciseConfig } from '../../types/seed-types'

/**
 * Authored content for JavaScript Fundamentals, chapter 1.
 *
 * This is the first chapter with real copy. It exists so the front end has a
 * complete, non-placeholder lesson, exercise and recap to render against.
 * Everything else still seeds with null content, which is deliberate: the gap
 * should be visible rather than hidden behind an empty object.
 */

export const introToJavascriptLesson = {
  markdown: `## What JavaScript is

JavaScript is the programming language of the web. It began in 1995 as a way to make pages
react to a click, and it now runs servers, build tools, and desktop applications.

Three things make it worth learning first:

- **It runs everywhere.** Every browser ships a JavaScript engine. You need nothing installed to start.
- **It is forgiving.** You can write a useful program before you understand types, memory, or compilation.
- **It is the default.** Most web tutorials, libraries, and job postings assume it.

## Where your code runs

A browser reads your HTML, and when it meets a \`<script>\` tag it hands the contents to its
JavaScript engine. The engine reads your program top to bottom and does what it says.

\`\`\`html
<script>
  console.log('Hello from the browser')
</script>
\`\`\`

Open the developer console in your browser and you will see the message. \`console.log\` is how you
ask the program to tell you something, and you will use it constantly while learning.

## Statements

A JavaScript program is a list of statements. Each one tells the engine to do a single thing.

\`\`\`javascript
console.log('first')
console.log('second')
\`\`\`

The engine runs these in order. Nothing happens in parallel, and nothing is skipped.

Semicolons at the end of a statement are optional. JavaScript inserts them for you. Teams disagree
about whether to write them; pick one style and stay consistent.

## What comes next

In the next section you will store values in variables, which is what lets a program remember
anything between one statement and the next.`,
  references: [
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction',
    'https://developer.mozilla.org/en-US/docs/Web/API/console/log_static',
  ],
}

export const jsBasicsRecap = {
  summary:
    'JavaScript is the language browsers run. A program is an ordered list of statements, and variables ' +
    'are how a program remembers values between them. You met const, let, and the primitive types.',
  key_points: [
    'Every browser ships a JavaScript engine, so no installation is needed to start.',
    'A program is a list of statements that run top to bottom, in order.',
    'console.log prints a value so you can see what your program is doing.',
    'const declares a binding that cannot be reassigned; let declares one that can.',
    'Prefer const by default and reach for let only when you need to reassign.',
    'The primitive types you will meet first are string, number, and boolean.',
    'typeof reports the type of a value as a string.',
    'Semicolons are optional, but a consistent style matters more than which one you choose.',
  ],
}

export const variablesExercise: ExerciseConfig = {
  seedSequence: 1,
  exercise_display_number: 1,
  estimated_time_minutes: 12,
  difficulty: 'easy',
  instructions: `Declare three variables and export a summary of them.

1. Declare \`courseName\` holding the string \`"JavaScript Fundamentals"\`. It never changes, so use \`const\`.
2. Declare \`lessonsCompleted\` holding the number \`0\`. It will change as a student works, so use \`let\`.
3. Declare \`isEnrolled\` holding the boolean \`true\`.
4. Complete \`describeProgress\` so it returns a string in exactly this shape:

   \`JavaScript Fundamentals: 0 lessons done (enrolled)\`

   When \`isEnrolled\` is \`false\`, the parenthesised word should be \`not enrolled\` instead.`,
  code_files: {
    files: [
      {
        filename: 'variables.js',
        language: 'javascript',
        content: `// 1. A value that never changes.
const courseName = ''

// 2. A value that will change as the student progresses.
let lessonsCompleted = 0

// 3. Is the student enrolled?
const isEnrolled = true

export function describeProgress(enrolled = isEnrolled) {
  // 4. Return the summary string described in the instructions.
  // enrolled defaults to isEnrolled; the last check calls it with false.
  return ''
}

export { courseName, lessonsCompleted, isEnrolled }
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'variables.js',
  },
  tests: {
    tests: [
      {
        name: 'courseName holds the course title',
        description: 'courseName should be the exact string "JavaScript Fundamentals".',
        testFunction: "assert.strictEqual(courseName, 'JavaScript Fundamentals')",
        expectedOutput: 'JavaScript Fundamentals',
      },
      {
        name: 'lessonsCompleted starts at zero',
        description: 'lessonsCompleted should be the number 0, not the string "0".',
        testFunction: "assert.strictEqual(lessonsCompleted, 0); assert.strictEqual(typeof lessonsCompleted, 'number')",
        expectedOutput: 0,
      },
      {
        name: 'isEnrolled is a boolean',
        description: 'isEnrolled should be the boolean true.',
        testFunction: "assert.strictEqual(isEnrolled, true); assert.strictEqual(typeof isEnrolled, 'boolean')",
        expectedOutput: true,
      },
      {
        name: 'describeProgress formats an enrolled student',
        description: 'The returned string must match the shape given in the instructions.',
        testFunction: "assert.strictEqual(describeProgress(), 'JavaScript Fundamentals: 0 lessons done (enrolled)')",
        expectedOutput: 'JavaScript Fundamentals: 0 lessons done (enrolled)',
      },
      {
        name: 'describeProgress handles a student who is not enrolled',
        description: 'When isEnrolled is false the summary should end with "(not enrolled)".',
        testFunction: 'assert.match(describeProgress(false), /\\(not enrolled\\)$/)',
        expectedOutput: 'JavaScript Fundamentals: 0 lessons done (not enrolled)',
        timeout: 2000,
      },
    ],
  },
  hints: {
    hints: [
      {
        order: 1,
        type: 'text',
        content: 'Use const when a value never gets reassigned, and let when it does.',
        showAfterAttempts: 1,
      },
      {
        order: 2,
        type: 'text',
        content: 'A template literal lets you build a string from values: `${courseName}: ${lessonsCompleted}`.',
        showAfterAttempts: 2,
      },
      {
        order: 3,
        type: 'code',
        content: "const label = isEnrolled ? 'enrolled' : 'not enrolled'",
        showAfterAttempts: 3,
      },
      {
        order: 4,
        type: 'text',
        content: 'Check the spacing and punctuation against the instructions. The tests compare exactly.',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `const courseName = 'JavaScript Fundamentals'
let lessonsCompleted = 0
const isEnrolled = true

export function describeProgress(enrolled = isEnrolled) {
  const label = enrolled ? 'enrolled' : 'not enrolled'
  return \`\${courseName}: \${lessonsCompleted} lessons done (\${label})\`
}

export { courseName, lessonsCompleted, isEnrolled }
`,
    explanation:
      'courseName and isEnrolled never get reassigned, so they are const. lessonsCompleted will change as the ' +
      'student works, so it is let. describeProgress builds the summary with a template literal and picks the ' +
      'parenthesised label with a ternary.',
  },
}
