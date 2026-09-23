import type { ExerciseConfig } from '../../types/seed-types'

/**
 * Authored content for JavaScript Fundamentals, chapter 3, sections 2, 4 and 5.
 *
 * Completes the chapter, and with it the course. Section 2 goes deeper than
 * the chapter opener; sections 4 and 5 are pure-logic exercises, so neither
 * carries `browser_html`.
 */

export const arrayMethodsLesson = {
  markdown: `The previous section met \`map\`, \`filter\` and \`reduce\`. This one covers the rest of the set,
and when to reach for which.

## Finding one thing

\`find\` returns the first item that passes a test, or \`undefined\`.

\`\`\`javascript
const lessons = [
  { title: 'Variables', done: true },
  { title: 'Functions', done: false },
  { title: 'Arrays', done: false },
]

lessons.find(lesson => !lesson.done)      // { title: 'Functions', done: false }
lessons.findIndex(lesson => !lesson.done) // 1
\`\`\`

Reach for \`find\` when you want the item. Reach for \`filter\` when you want all of them. Using
\`filter(...)[0]\` works but says the wrong thing, and keeps scanning after it has the answer.

## Asking a yes-or-no question

\`some\` is true when at least one item passes. \`every\` is true when they all do.

\`\`\`javascript
lessons.some(lesson => lesson.done)   // true
lessons.every(lesson => lesson.done)  // false
\`\`\`

Both stop as soon as they know the answer. An empty array gives \`false\` for \`some\` and, less
obviously, \`true\` for \`every\`. That is not a quirk to memorise: "every item passes" is trivially
true when there are no items, and it is worth deciding what your code should do about that case.

\`includes\` is the simpler version for plain values.

\`\`\`javascript
['js', 'ts'].includes('ts')  // true
\`\`\`

## Chaining

Because \`map\` and \`filter\` return arrays, they compose.

\`\`\`javascript
const titles = lessons
  .filter(lesson => !lesson.done)
  .map(lesson => lesson.title)
// ["Functions", "Arrays"]
\`\`\`

Read a chain top to bottom as a sentence: take the lessons, keep the unfinished ones, take their
titles. Each step walks the array again, which is irrelevant at this size and worth noticing at a
million items.

Filter before you map. Transforming items you are about to discard is wasted work, and the
filter is usually easier to read against the original shape.

## The arguments you usually ignore

Every callback receives three arguments: the item, its index, and the whole array.

\`\`\`javascript
lessons.map((lesson, index) => \`\${index + 1}. \${lesson.title}\`)
\`\`\`

The third is rarely useful. The index is, often enough to remember it exists.

This is also the classic trap:

\`\`\`javascript
['1', '2', '3'].map(parseInt)  // [1, NaN, NaN]
\`\`\`

\`map\` passes the index as a second argument, \`parseInt\` reads that as a radix, and parsing "2"
in base 1 is nonsense. Write \`map(n => parseInt(n, 10))\` and the problem disappears. The lesson
generalises: be careful handing a function straight to \`map\` when you do not know its full
signature.

## Flattening

\`flatMap\` maps, then flattens one level. It is the tool for "each item becomes zero or more
items".

\`\`\`javascript
const chapters = [
  { sections: ['a', 'b'] },
  { sections: ['c'] },
]

chapters.flatMap(chapter => chapter.sections)  // ["a", "b", "c"]
\`\`\`

Returning an empty array from the callback drops that item, which makes \`flatMap\` a filter and a
map at once.

## Sorting

\`sort\` compares as strings unless you tell it otherwise, which surprises everyone once.

\`\`\`javascript
[10, 9, 1].sort()                  // [1, 10, 9]
[10, 9, 1].sort((a, b) => a - b)   // [1, 9, 10]
\`\`\`

The comparator returns a negative number when \`a\` comes first, positive when \`b\` does, and zero
when it does not matter.

\`sort\` also modifies the array in place and returns it, so the original order is gone. Use
\`toSorted\` when you want a copy:

\`\`\`javascript
const byTitle = lessons.toSorted((a, b) => a.title.localeCompare(b.title))
\`\`\`

\`localeCompare\` is the right way to sort strings. \`a > b\` compares code points, which puts
every capital letter before every lowercase one.

## Which one

| You want | Use |
| --- | --- |
| Every item, transformed | \`map\` |
| Some of the items | \`filter\` |
| The first match | \`find\` |
| Its position | \`findIndex\` |
| Yes or no | \`some\`, \`every\`, \`includes\` |
| One value from many | \`reduce\` |
| A flattened result | \`flatMap\` |
| A new order | \`toSorted\` |

When nothing fits, a plain \`for...of\` loop is not a failure. Reach for it when the alternative is
a \`reduce\` nobody can read.`,
  references: [
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#instance_methods',
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort',
  ],
}

export const queryExercise: ExerciseConfig = {
  seedSequence: 1,
  exercise_display_number: 1,
  estimated_time_minutes: 20,
  difficulty: 'medium',
  instructions: `Answer questions about a list of lessons.

**catalogue.js** (read only) exports \`lessons\`, an array of
\`{ title, minutes, done, tags }\`.

In **queries.js**, export four functions. Each takes the array as its only argument.

1. \`firstUnfinished(items)\` returns the first lesson whose \`done\` is false, or \`undefined\`
   when there is none. Return the lesson, not its title.
2. \`allDone(items)\` is true only when every lesson is finished. Decide what an empty array
   should mean and make it return \`false\`: an empty course is not a finished one.
3. \`titlesByLength(items)\` returns the titles, shortest first, as an array of strings. Break ties
   alphabetically. Do not disturb the order of \`items\` itself.
4. \`allTags(items)\` returns every tag across every lesson, with no duplicates, sorted
   alphabetically.`,
  code_files: {
    files: [
      {
        filename: 'catalogue.js',
        language: 'javascript',
        content: `// The lessons your functions are asked about. You do not need to change this.

export const lessons = [
  { title: 'Arrays', minutes: 40, done: false, tags: ['data', 'core'] },
  { title: 'Variables', minutes: 20, done: true, tags: ['core'] },
  { title: 'Objects', minutes: 25, done: false, tags: ['data', 'core'] },
  { title: 'Functions', minutes: 35, done: true, tags: ['core', 'logic'] },
]
`,
        isReadOnly: true,
        isHidden: false,
      },
      {
        filename: 'queries.js',
        language: 'javascript',
        content: `// 1. The first lesson that is not done, or undefined.
export function firstUnfinished(items) {}

// 2. True only when there is at least one lesson and all of them are done.
export function allDone(items) {}

// 3. Titles, shortest first, ties broken alphabetically. Leave items alone.
export function titlesByLength(items) {}

// 4. Every tag, deduplicated, sorted alphabetically.
export function allTags(items) {}
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'queries.js',
  },
  tests: {
    tests: [
      {
        name: 'firstUnfinished returns the lesson itself',
        description: 'The first lesson with done: false, not its title and not its index.',
        testFunction:
          "const r = firstUnfinished([{title:'a',done:true},{title:'b',done:false},{title:'c',done:false}]); assert.strictEqual(r.title, 'b')",
        expectedOutput: 'b',
      },
      {
        name: 'firstUnfinished returns undefined when everything is done',
        description: 'No match means undefined, not null and not an empty object.',
        testFunction: "assert.strictEqual(firstUnfinished([{title:'a',done:true}]), undefined)",
        expectedOutput: undefined,
      },
      {
        name: 'allDone is true only when every lesson is finished',
        description: 'One unfinished lesson is enough to make it false.',
        testFunction:
          'assert.strictEqual(allDone([{done:true},{done:true}]), true); assert.strictEqual(allDone([{done:true},{done:false}]), false)',
        expectedOutput: true,
      },
      {
        name: 'allDone is false for an empty list',
        description: 'every() returns true for an empty array, so this case needs handling.',
        testFunction: 'assert.strictEqual(allDone([]), false)',
        expectedOutput: false,
      },
      {
        name: 'titlesByLength sorts shortest first',
        description: 'Shortest title first, with ties broken alphabetically.',
        testFunction:
          "assert.deepStrictEqual(titlesByLength([{title:'Arrays'},{title:'Objects'},{title:'Maps'}]), ['Maps','Arrays','Objects'])",
        expectedOutput: ['Maps', 'Arrays', 'Objects'],
      },
      {
        name: 'titlesByLength breaks ties alphabetically',
        description: 'Two titles of the same length sort by name.',
        testFunction: "assert.deepStrictEqual(titlesByLength([{title:'zeta'},{title:'alfa'}]), ['alfa','zeta'])",
        expectedOutput: ['alfa', 'zeta'],
      },
      {
        name: 'titlesByLength leaves the input alone',
        description: 'sort() mutates; this must not reorder the array it was given.',
        testFunction:
          "const input = [{title:'Objects'},{title:'Maps'}]; titlesByLength(input); assert.strictEqual(input[0].title, 'Objects')",
        expectedOutput: 'Objects',
      },
      {
        name: 'allTags deduplicates and sorts',
        description: 'Every tag once, in alphabetical order.',
        testFunction:
          "assert.deepStrictEqual(allTags([{tags:['core','data']},{tags:['core']},{tags:['logic']}]), ['core','data','logic'])",
        expectedOutput: ['core', 'data', 'logic'],
      },
      {
        name: 'allTags handles a lesson with no tags',
        description: 'An empty tag list should contribute nothing, not undefined.',
        testFunction: "assert.deepStrictEqual(allTags([{tags:[]},{tags:['core']}]), ['core'])",
        expectedOutput: ['core'],
      },
    ],
  },
  hints: {
    hints: [
      {
        order: 1,
        type: 'text',
        content: 'find returns the item; filter returns an array. Question 1 wants the item.',
        showAfterAttempts: 1,
      },
      {
        order: 2,
        type: 'text',
        content: 'For allDone, check the length before calling every, because every([]) is true.',
        showAfterAttempts: 2,
      },
      {
        order: 3,
        type: 'code',
        content: 'items.map(l => l.title).toSorted((a, b) => a.length - b.length || a.localeCompare(b))',
        showAfterAttempts: 3,
      },
      {
        order: 4,
        type: 'code',
        content: '[...new Set(items.flatMap(l => l.tags))].toSorted()',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `export function firstUnfinished(items) {
  return items.find(lesson => !lesson.done)
}

export function allDone(items) {
  return items.length > 0 && items.every(lesson => lesson.done)
}

export function titlesByLength(items) {
  return items.map(lesson => lesson.title).toSorted((a, b) => a.length - b.length || a.localeCompare(b))
}

export function allTags(items) {
  return [...new Set(items.flatMap(lesson => lesson.tags))].toSorted()
}
`,
    explanation:
      'find stops at the first match and returns undefined when there is none, which is exactly ' +
      'what question 1 asks for. allDone needs the length check because every() is true for an ' +
      'empty array. titlesByLength maps first, so toSorted copies the array of titles and the ' +
      'input is never touched; the `||` falls through to localeCompare only when the lengths tie. ' +
      'flatMap collapses the tag arrays into one, a Set removes duplicates, and the spread turns ' +
      'it back into an array that toSorted can order.',
  },
}

export const groupingExercise: ExerciseConfig = {
  seedSequence: 2,
  exercise_display_number: 2,
  estimated_time_minutes: 25,
  difficulty: 'hard',
  instructions: `Summarise the same catalogue, this time collapsing it down to single values.

**catalogue.js** (read only) exports the same \`lessons\` array.

In **summary.js**, export three functions.

1. \`byTag(items)\` returns an object mapping each tag to an array of the titles carrying it,
   in the order the lessons appear. A lesson with two tags appears under both.
2. \`longest(items)\` returns the title of the lesson with the most minutes. When two tie, return
   the one that appears first. An empty array gives \`null\`.
3. \`progress(items)\` returns \`{ done, total, minutesLeft }\`, counting finished lessons, all
   lessons, and the minutes belonging to the unfinished ones.

Write \`byTag\` and \`progress\` with \`reduce\`. You could use a loop, and sometimes should, but the
point here is to get comfortable with the accumulator.`,
  code_files: {
    files: [
      {
        filename: 'catalogue.js',
        language: 'javascript',
        content: `// The same lessons as the previous exercise. You do not need to change this.

export const lessons = [
  { title: 'Arrays', minutes: 40, done: false, tags: ['data', 'core'] },
  { title: 'Variables', minutes: 20, done: true, tags: ['core'] },
  { title: 'Objects', minutes: 25, done: false, tags: ['data', 'core'] },
  { title: 'Functions', minutes: 35, done: true, tags: ['core', 'logic'] },
]
`,
        isReadOnly: true,
        isHidden: false,
      },
      {
        filename: 'summary.js',
        language: 'javascript',
        content: `// 1. { tag: [titles carrying it] }, in the order the lessons appear.
export function byTag(items) {}

// 2. Title of the longest lesson, first one on a tie, null when empty.
export function longest(items) {}

// 3. { done, total, minutesLeft } where minutesLeft counts unfinished lessons only.
export function progress(items) {}
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'summary.js',
  },
  tests: {
    tests: [
      {
        name: 'byTag groups titles under every tag they carry',
        description: 'A lesson with two tags appears under both.',
        testFunction:
          "assert.deepStrictEqual(byTag([{title:'A',tags:['x','y']},{title:'B',tags:['x']}]), { x: ['A','B'], y: ['A'] })",
        expectedOutput: { x: ['A', 'B'], y: ['A'] },
      },
      {
        name: 'byTag keeps the order the lessons appear in',
        description: 'Titles within a tag follow the input order, not alphabetical order.',
        testFunction:
          "assert.deepStrictEqual(byTag([{title:'Zed',tags:['x']},{title:'Amy',tags:['x']}]).x, ['Zed','Amy'])",
        expectedOutput: ['Zed', 'Amy'],
      },
      {
        name: 'byTag returns an empty object for an empty list',
        description: 'No lessons means no tags, not undefined.',
        testFunction: 'assert.deepStrictEqual(byTag([]), {})',
        expectedOutput: {},
      },
      {
        name: 'longest returns the title of the longest lesson',
        description: 'The title, not the lesson and not the number of minutes.',
        testFunction: "assert.strictEqual(longest([{title:'A',minutes:10},{title:'B',minutes:30}]), 'B')",
        expectedOutput: 'B',
      },
      {
        name: 'longest keeps the first on a tie',
        description: 'Two lessons of equal length: the earlier one wins.',
        testFunction: "assert.strictEqual(longest([{title:'A',minutes:30},{title:'B',minutes:30}]), 'A')",
        expectedOutput: 'A',
      },
      {
        name: 'longest returns null for an empty list',
        description: 'Nothing to pick means null, not undefined.',
        testFunction: 'assert.strictEqual(longest([]), null)',
        expectedOutput: null,
      },
      {
        name: 'progress counts finished lessons and remaining minutes',
        description: 'minutesLeft counts only the lessons that are not done.',
        testFunction:
          'assert.deepStrictEqual(progress([{minutes:10,done:true},{minutes:30,done:false}]), { done: 1, total: 2, minutesLeft: 30 })',
        expectedOutput: { done: 1, total: 2, minutesLeft: 30 },
      },
      {
        name: 'progress handles an empty list',
        description: 'Zeroes across the board rather than NaN.',
        testFunction: 'assert.deepStrictEqual(progress([]), { done: 0, total: 0, minutesLeft: 0 })',
        expectedOutput: { done: 0, total: 0, minutesLeft: 0 },
      },
    ],
  },
  hints: {
    hints: [
      {
        order: 1,
        type: 'code',
        content: 'items.reduce((groups, lesson) => { /* push lesson.title into groups[tag] */ return groups }, {})',
        showAfterAttempts: 1,
      },
      {
        order: 2,
        type: 'text',
        content: 'Inside byTag, create the array the first time you meet a tag: groups[tag] ??= [].',
        showAfterAttempts: 2,
      },
      {
        order: 3,
        type: 'text',
        content: 'For longest, use a strict greater-than so an equal value never replaces the earlier one.',
        showAfterAttempts: 3,
      },
      {
        order: 4,
        type: 'text',
        content: 'progress can accumulate all three numbers in one reduce, starting from the empty answer.',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `export function byTag(items) {
  return items.reduce((groups, lesson) => {
    for (const tag of lesson.tags) {
      groups[tag] ??= []
      groups[tag].push(lesson.title)
    }
    return groups
  }, {})
}

export function longest(items) {
  if (items.length === 0) return null
  return items.reduce((best, lesson) => (lesson.minutes > best.minutes ? lesson : best)).title
}

export function progress(items) {
  return items.reduce(
    (totals, lesson) => ({
      done: totals.done + (lesson.done ? 1 : 0),
      total: totals.total + 1,
      minutesLeft: totals.minutesLeft + (lesson.done ? 0 : lesson.minutes),
    }),
    { done: 0, total: 0, minutesLeft: 0 },
  )
}
`,
    explanation:
      'byTag starts from an empty object and pushes into it. `??=` creates the array the first ' +
      'time a tag appears, which is shorter than checking for undefined. longest reduces without ' +
      'an initial value, so the first lesson is the starting best; a strict `>` means an equal ' +
      'value never displaces it, which is what "first on a tie" requires. progress accumulates ' +
      'all three numbers at once, and starting from the empty answer is what makes the empty ' +
      'array return zeroes rather than NaN.',
  },
}
