import type { ExerciseConfig } from '../../types/seed-types'

/**
 * Authored content for JavaScript Fundamentals, chapter 3.
 *
 * The exercise renders into real markup, so it is the first one whose
 * `browser_html` drives the live preview rather than sitting unused.
 */

export const arraysLesson = {
  markdown: `## An array holds an ordered list

\`\`\`javascript
const lessons = ['Variables', 'Functions', 'Arrays']

lessons.length   // 3
lessons[0]       // "Variables"
lessons.at(-1)   // "Arrays"
\`\`\`

Indexes start at zero, so the last item is at \`length - 1\`. \`at(-1)\` says the same thing without
the arithmetic.

## The three methods you will reach for constantly

**\`map\`** makes a new array by transforming every item.

\`\`\`javascript
const lengths = lessons.map(name => name.length) // [9, 9, 6]
\`\`\`

**\`filter\`** makes a new array of the items that pass a test.

\`\`\`javascript
const short = lessons.filter(name => name.length < 7) // ["Arrays"]
\`\`\`

**\`reduce\`** collapses an array down to a single value.

\`\`\`javascript
const total = [1, 2, 3].reduce((sum, n) => sum + n, 0) // 6
\`\`\`

All three leave the original array alone. That matters: a method that returns a new array is safe
to chain, while one that changes the array in place can surprise code elsewhere.

## Changing an array versus replacing it

\`sort\` and \`reverse\` modify the array they are called on. \`toSorted\` and \`toReversed\` return a
copy instead, which is usually what you want:

\`\`\`javascript
const sorted = lessons.toSorted()  // lessons is unchanged
\`\`\`

## Putting a list on the page

\`document.querySelector\` finds an element, and you can build markup from an array with \`map\` and
\`join\`:

\`\`\`javascript
const list = document.querySelector('#lessons')
list.innerHTML = lessons.map(name => \`<li>\${name}</li>\`).join('')
\`\`\`

The exercise in the next section does exactly this, and you can watch it render.`,
  references: [
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
    'https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector',
  ],
}

export const arraysRecap = {
  summary:
    'Arrays hold ordered lists. map, filter and reduce cover most of what you will do with them, ' +
    'and all three return something new rather than changing the original. Rendering a list to the ' +
    'page is map plus join.',
  key_points: [
    'Indexes start at zero; `at(-1)` reads the last item without arithmetic.',
    '`map` transforms every item into a new array of the same length.',
    '`filter` keeps the items that pass a test.',
    '`reduce` collapses an array into one value, starting from an initial value.',
    'map, filter and reduce all leave the original array alone.',
    '`sort` and `reverse` change the array in place; `toSorted` and `toReversed` return a copy.',
    'Build markup from an array with `map` then `join()` on an empty string, so there are no stray commas.',
  ],
}

export const lessonListExercise: ExerciseConfig = {
  seedSequence: 1,
  exercise_display_number: 1,
  estimated_time_minutes: 25,
  difficulty: 'medium',
  instructions: `Render a course outline into the page.

**data.js** (read only) exports \`lessons\`, an array of \`{ title, minutes, done }\`.

In **render.js**:

1. Export \`totalMinutes(items)\`, the sum of every \`minutes\` value. An empty array gives \`0\`.
2. Export \`remaining(items)\`, only the lessons where \`done\` is false.
3. Export \`toListItems(items)\`, a single HTML string of one \`<li>\` per lesson, each reading
   \`<li>Title — 20 min</li>\`. Use an em dash with a space either side. No separator between the
   items.
4. Export \`render(items)\`, which puts that markup inside \`#lessons\` and writes
   \`3 lessons left, 95 minutes total\` into \`#summary\`. Pluralise "lesson" correctly.

Press **Run preview** to watch it render, and **Run checks** to grade it.`,
  browser_html: {
    files: [
      {
        filename: 'index.html',
        content: `<main style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 32rem">
  <h1 style="font-size: 1.25rem">Course outline</h1>
  <ul id="lessons"></ul>
  <p id="summary" style="color: #555"></p>
</main>`,
        isHidden: false,
      },
    ],
    defaultView: 'index.html',
  },
  code_files: {
    files: [
      {
        filename: 'data.js',
        language: 'javascript',
        content: `// The lessons to render. You do not need to change this file.

export const lessons = [
  { title: 'Variables', minutes: 20, done: true },
  { title: 'Functions', minutes: 35, done: false },
  { title: 'Arrays', minutes: 40, done: false },
  { title: 'Objects', minutes: 20, done: false },
]
`,
        isReadOnly: true,
        isHidden: false,
      },
      {
        filename: 'render.js',
        language: 'javascript',
        content: `import { lessons } from './data.js'

// 1. Sum every minutes value. An empty array gives 0.
export function totalMinutes(items) {
  return 0
}

// 2. Only the lessons that are not done.
export function remaining(items) {
  return []
}

// 3. One <li> per lesson: "<li>Variables — 20 min</li>", joined with nothing.
export function toListItems(items) {
  return ''
}

// 4. Put the list inside #lessons and the summary inside #summary.
export function render(items) {}

render(lessons)
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'render.js',
  },
  tests: {
    tests: [
      {
        name: 'totalMinutes adds every lesson up',
        description: 'The four seeded lessons come to 115 minutes.',
        testFunction:
          'assert.strictEqual(totalMinutes([{minutes: 20}, {minutes: 35}]), 55); assert.strictEqual(totalMinutes([]), 0)',
        expectedOutput: 55,
      },
      {
        name: 'remaining keeps only unfinished lessons',
        description: 'A lesson with done: true should be left out.',
        testFunction:
          "assert.deepStrictEqual(remaining([{title:'a',done:true},{title:'b',done:false}]), [{title:'b',done:false}])",
        expectedOutput: [{ title: 'b', done: false }],
      },
      {
        name: 'toListItems builds one li per lesson',
        description: 'Each item reads "<li>Title — 20 min</li>" with nothing between them.',
        testFunction:
          "assert.strictEqual(toListItems([{title:'Arrays',minutes:40},{title:'Objects',minutes:20}]), '<li>Arrays \\u2014 40 min</li><li>Objects \\u2014 20 min</li>')",
        expectedOutput: '<li>Arrays — 40 min</li><li>Objects — 20 min</li>',
      },
      {
        name: 'toListItems returns nothing for an empty list',
        description: 'No lessons means no markup, not an empty <li>.',
        testFunction: "assert.strictEqual(toListItems([]), '')",
        expectedOutput: '',
      },
      {
        name: 'render is exported and callable',
        description: 'render should be a function taking the list of lessons.',
        testFunction: "assert.strictEqual(typeof render, 'function')",
        expectedOutput: 'function',
      },
    ],
  },
  hints: {
    hints: [
      {
        order: 1,
        type: 'code',
        content: 'items.reduce((sum, lesson) => sum + lesson.minutes, 0)',
        showAfterAttempts: 1,
      },
      {
        order: 2,
        type: 'text',
        content: 'filter takes a test that returns true for the items you want to keep.',
        showAfterAttempts: 2,
      },
      {
        order: 3,
        type: 'code',
        content: "items.map(lesson => `<li>${lesson.title} \\u2014 ${lesson.minutes} min</li>`).join('')",
        showAfterAttempts: 3,
      },
      {
        order: 4,
        type: 'text',
        content:
          'In render, use document.querySelector to find #lessons and #summary, then set innerHTML and textContent.',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `import { lessons } from './data.js'

export function totalMinutes(items) {
  return items.reduce((sum, lesson) => sum + lesson.minutes, 0)
}

export function remaining(items) {
  return items.filter(lesson => !lesson.done)
}

export function toListItems(items) {
  return items.map(lesson => \`<li>\${lesson.title} \\u2014 \${lesson.minutes} min</li>\`).join('')
}

export function render(items) {
  document.querySelector('#lessons').innerHTML = toListItems(items)
  const left = remaining(items).length
  const word = left === 1 ? 'lesson' : 'lessons'
  document.querySelector('#summary').textContent =
    \`\${left} \${word} left, \${totalMinutes(items)} minutes total\`
}

render(lessons)
`,
    explanation:
      'reduce starts from 0 so an empty array gives 0 rather than undefined. filter keeps the items ' +
      'whose done is false. join with an empty string avoids the commas that map alone would leave ' +
      'behind. render reads the DOM once and writes both elements, so it can be called again after ' +
      'the data changes.',
  },
}
