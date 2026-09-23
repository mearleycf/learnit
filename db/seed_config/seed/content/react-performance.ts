import type { ExerciseConfig } from '../../types/seed-types'

/**
 * Authored content for Advanced React Development, chapters 1 and 3.
 *
 * Chapter 1's exercise is not here. It is about writing components, which the
 * runner cannot execute; see the vault questions. Its lesson carries a worked
 * example to read instead.
 */

export const componentArchitectureLesson = {
  markdown: `This chapter is a review. If you already split components confidently, skim it and move to
chapter 2, where the new material starts.

## What a component is for

A component exists to give a name to a piece of interface and the behaviour attached to it. That
is the whole job. Splitting for any other reason usually makes things worse.

Good reasons to split:

- The same markup appears twice.
- A piece has its own state that nothing else cares about.
- The file has grown past what you can hold in your head.
- One part re-renders far more often than the rest.

A bad reason: the file is long. Length alone is not complexity. Three hundred lines describing
one screen, read top to bottom, is easier than eight files you have to jump between.

## Composition beats configuration

When a component grows options, it is usually asking to be composed instead.

\`\`\`jsx
// Configuration: every new case is another prop, and they interact.
<Card title="Arrays" showFooter footerText="40 min" highlight />

// Composition: the caller assembles what it needs.
<Card>
  <Card.Title>Arrays</Card.Title>
  <Card.Footer>40 min</Card.Footer>
</Card>
\`\`\`

The first version has to anticipate every use. The second does not: a caller that wants
something new writes it, without touching \`Card\`. The tell is a boolean prop that only exists to
switch a piece of markup on.

## Passing children is passing a hole

\`children\` is not just for wrappers. Handing a component the thing to render lets the parent
decide, which often removes a prop entirely.

\`\`\`jsx
function Panel({ heading, children }) {
  return (
    <section>
      <h2>{heading}</h2>
      {children}
    </section>
  )
}
\`\`\`

This also happens to help performance, and chapter 3 explains why: content passed as
\`children\` is created by the parent, so it does not get rebuilt when \`Panel\` re-renders.

## Prop drilling is only a problem when it is

Passing a prop through two layers is fine. Through six, where the middle four only forward it,
is a smell. The usual fixes, in order of how much they cost:

1. Move the state down, if only the leaf needed it.
2. Pass the rendered element instead of the data, so the middle layers carry nothing.
3. Context, once several distant places genuinely need the same value.

Reaching for context first is the common mistake. It makes the value available everywhere, which
sounds like a benefit until you are trying to work out which component changed.

## A worked example

Here is a lesson list, split the way the rules above suggest. There is no exercise for this
section, so read it and ask what each split buys.

\`\`\`jsx
// Knows how to fetch and hold state. Renders almost nothing itself.
function LessonListContainer({ courseId }) {
  const [lessons, setLessons] = useState([])
  useEffect(() => {
    let cancelled = false
    fetchLessons(courseId).then(result => {
      if (!cancelled) setLessons(result)
    })
    return () => {
      cancelled = true
    }
  }, [courseId])

  return <LessonList lessons={lessons} />
}

// Knows how to display a list. No fetching, no effects, trivial to test.
function LessonList({ lessons }) {
  const remaining = lessons.filter(lesson => !lesson.done).length

  return (
    <section>
      <ul>
        {lessons.map(lesson => (
          <LessonRow key={lesson.id} lesson={lesson} />
        ))}
      </ul>
      <p>{remaining} left</p>
    </section>
  )
}

// One row. Its own state, because no one else cares whether it is expanded.
function LessonRow({ lesson }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <li>
      <button onClick={() => setExpanded(!expanded)}>{lesson.title}</button>
      {expanded && <p>{lesson.summary}</p>}
    </li>
  )
}
\`\`\`

Three things worth noticing:

- \`remaining\` is computed, not stored. It cannot fall out of step with \`lessons\`.
- \`expanded\` lives in the row. Putting it in the list would mean the list re-renders whenever
  any row opens, and would need a map of ids to booleans.
- The effect has a cleanup. Without \`cancelled\`, a response arriving after the id changed would
  overwrite the newer data with older data. That bug is invisible until the network is slow.

The \`key\` is \`lesson.id\`, not the array index. Index keys break the moment the list reorders:
React reuses the wrong component and state ends up attached to the wrong row.`,
  references: [
    'https://react.dev/learn/thinking-in-react',
    'https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children',
    'https://react.dev/learn/rendering-lists#why-does-react-need-keys',
  ],
}

export const reactFundamentalsRecap = {
  summary:
    'Components name a piece of interface and the behaviour attached to it. Split when markup ' +
    'repeats, when a piece owns state nothing else needs, or when one part re-renders far more ' +
    'than the rest. Compose rather than adding options, and keep state as low as it will go.',
  key_points: [
    'Split for repetition, local state or differing render frequency, not for file length.',
    'A boolean prop that only switches markup on is a sign the component wants composing.',
    'Passing `children` hands the decision to the parent and often removes a prop.',
    'Prop drilling through two layers is fine; through six forwarding-only layers is not.',
    'Try moving state down or passing an element before reaching for context.',
    'Compute what you can derive; do not store it alongside its source.',
    'Keep an effect cancellable, or a slow response can overwrite newer data.',
    'Use a stable id as `key`, never the array index, or state attaches to the wrong row.',
  ],
}

export const performanceLesson = {
  markdown: `Most React performance work is wasted, because most of it is done without measuring. This
section is about knowing which work is worth doing.

## Why a component re-renders

Three reasons, and only three:

1. Its own state changed.
2. Its parent re-rendered.
3. A context it reads changed.

Number two catches people out. **A parent re-rendering re-renders every child**, whether or not
their props changed. That is usually fine: rendering is calling a function and comparing the
result. It becomes a problem when the tree is deep or a child is genuinely expensive.

## Referential equality is the whole game

React compares props with \`Object.is\`. For a string or a number that does what you expect. For
an object, an array or a function, it compares identity, not contents.

\`\`\`javascript
{ a: 1 } === { a: 1 }   // false
[] === []               // false
(() => {}) === (() => {}) // false
\`\`\`

Which means this child sees a new prop on every single render:

\`\`\`jsx
<LessonList options={{ sort: 'title' }} onSelect={() => choose(id)} />
\`\`\`

Both the object and the function are built fresh each time the parent runs. Nothing about them
changed, but they are not the same values, so any memoisation on \`LessonList\` is defeated.

## The three tools

\`useMemo\` keeps a computed value between renders. \`useCallback\` keeps a function. \`React.memo\`
skips a child's render when its props are unchanged by that same comparison.

\`\`\`jsx
const sorted = useMemo(() => lessons.toSorted(byTitle), [lessons])
const handleSelect = useCallback(id => choose(id), [choose])
const LessonList = React.memo(function LessonList({ lessons }) { /* ... */ })
\`\`\`

They work together or not at all. \`React.memo\` on a child that receives a fresh function every
render does nothing except add a comparison. That is the most common way this goes wrong: one of
the three applied, the other two forgotten, and the result is slower than doing nothing.

## The dependency array

The array says when to recompute. Get it wrong in either direction and you get a bug:

- **Too few dependencies** and you keep a stale value, closing over an old variable. This is the
  dangerous one, because it looks like it works.
- **Too many** and it recomputes every render, so the memo is pure overhead.

The eslint rule that checks this is worth having on. When you find yourself arguing with it, the
answer is almost always that the function should not have been defined there.

## When not to bother

Memoising is not free. It costs a comparison on every render, it holds the old value in memory,
and it makes the code harder to read.

Skip it when:

- The calculation is a \`filter\` or a \`map\` over a list you can see the end of.
- The component renders rarely.
- You have not measured.

That last one carries the others. Open the profiler, find what is actually slow, fix that. A
codebase covered in \`useMemo\` written by someone who never profiled is slower and harder to
change than one with none.

## Cheaper things to try first

Before reaching for memoisation:

- **Move state down.** If only one subtree cares, put the state there and the rest stops
  re-rendering.
- **Pass elements as children.** Content created by the parent is not rebuilt when the wrapper
  re-renders.
- **Split the component.** A frequently changing piece in its own component limits the damage.

Each of these removes work rather than caching it, which is always the better trade.

## What React.memo actually does

It is a shallow comparison of the previous props against the next ones. Same keys, and each
value equal by \`Object.is\`. Nothing deeper.

That is a small enough idea to write yourself, and the exercise in this chapter does exactly
that, along with the two caching helpers underneath \`useMemo\`.`,
  references: [
    'https://react.dev/reference/react/useMemo#should-you-add-usememo-everywhere',
    'https://react.dev/reference/react/memo',
    'https://react.dev/learn/render-and-commit',
  ],
}

export const performanceRecap = {
  summary:
    'A component re-renders when its own state changes, its parent re-renders, or a context it ' +
    'reads changes. Memoisation works by referential equality, so the three tools only help ' +
    'when used together. Removing work beats caching it, and measuring beats guessing.',
  key_points: [
    'Three causes of a re-render: own state, parent rendered, context changed.',
    'A parent re-rendering re-renders every child, regardless of whether props changed.',
    'React compares props with `Object.is`, so a fresh object or function is always a new prop.',
    '`React.memo` on a child receiving a new function every render does nothing but cost a comparison.',
    'Too few dependencies gives a stale value, which looks like it works; too many makes the memo pointless.',
    'Moving state down, passing children, and splitting components remove work rather than caching it.',
    'Do not memoise a filter over a short list, or anything you have not measured.',
    '`React.memo` is a shallow prop comparison, which is small enough to write yourself.',
  ],
}

export const memoExercise: ExerciseConfig = {
  seedSequence: 1,
  exercise_display_number: 1,
  estimated_time_minutes: 25,
  difficulty: 'hard',
  instructions: `Write the three pieces that sit under React's memoisation.

No React import here. \`React.memo\` is a shallow prop comparison and \`useMemo\` is a cache keyed
on a dependency array, and both are plain JavaScript once you take the hook away.

In **memo.js**, export three functions.

1. \`shallowEqual(a, b)\` is true when two objects have the same keys and each value is equal by
   \`Object.is\`. This is what \`React.memo\` does. \`Object.is\` matters: \`NaN\` equals itself and
   \`+0\` does not equal \`-0\`.
2. \`memoizeOne(fn)\` returns a wrapped function remembering **only the most recent** call. Called
   again with arguments equal by \`Object.is\`, it returns the cached result without calling
   \`fn\`. Different arguments replace the cache. This is the shape \`useMemo\` has.
3. \`memoize(fn, keyFor)\` returns a wrapped function caching **every** result, keyed by
   \`keyFor(...args)\`. When \`keyFor\` is omitted, use the first argument as the key. Give the
   wrapped function a \`.cache\` Map so a caller can inspect or clear it.

A cached call must not invoke \`fn\` again, which several of the checks verify by counting calls.`,
  code_files: {
    files: [
      {
        filename: 'memo.js',
        language: 'javascript',
        content: `// 1. Same keys, each value equal by Object.is. What React.memo does.
export function shallowEqual(a, b) {}

// 2. Remember only the most recent call. The shape useMemo has.
export function memoizeOne(fn) {}

// 3. Cache every result, keyed by keyFor(...args) or the first argument.
// Expose the Map as .cache on the returned function.
export function memoize(fn, keyFor) {}
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'memo.js',
  },
  tests: {
    tests: [
      {
        name: 'shallowEqual accepts objects with equal values',
        description: 'Same keys and same values, compared one level deep.',
        testFunction: "assert.strictEqual(shallowEqual({a:1,b:'x'}, {a:1,b:'x'}), true)",
        expectedOutput: true,
      },
      {
        name: 'shallowEqual rejects a differing value',
        description: 'One value out of step is enough.',
        testFunction: 'assert.strictEqual(shallowEqual({a:1}, {a:2}), false)',
        expectedOutput: false,
      },
      {
        name: 'shallowEqual rejects a different set of keys',
        description: 'An extra key on either side means not equal.',
        testFunction:
          'assert.strictEqual(shallowEqual({a:1}, {a:1,b:2}), false); assert.strictEqual(shallowEqual({a:1,b:2}, {a:1}), false)',
        expectedOutput: false,
      },
      {
        name: 'shallowEqual does not look inside nested objects',
        description: 'Shallow means shallow: two equal-looking nested objects are different references.',
        testFunction: 'assert.strictEqual(shallowEqual({a:{n:1}}, {a:{n:1}}), false)',
        expectedOutput: false,
      },
      {
        name: 'shallowEqual follows Object.is on NaN and signed zero',
        description: 'NaN equals itself; +0 does not equal -0. This is why Object.is, not ===.',
        testFunction:
          'assert.strictEqual(shallowEqual({a:NaN}, {a:NaN}), true); assert.strictEqual(shallowEqual({a:0}, {a:-0}), false)',
        expectedOutput: true,
      },
      {
        name: 'memoizeOne returns the cached result for the same arguments',
        description: 'The wrapped function must not run a second time.',
        testFunction:
          'let calls = 0; const f = memoizeOne((a, b) => { calls += 1; return a + b }); assert.strictEqual(f(1, 2), 3); assert.strictEqual(f(1, 2), 3); assert.strictEqual(calls, 1)',
        expectedOutput: 1,
      },
      {
        name: 'memoizeOne recomputes when an argument changes',
        description: 'Different arguments mean a real call.',
        testFunction:
          'let calls = 0; const f = memoizeOne((a) => { calls += 1; return a * 2 }); f(1); f(2); assert.strictEqual(calls, 2)',
        expectedOutput: 2,
      },
      {
        name: 'memoizeOne only remembers the most recent call',
        description: 'Going back to an earlier argument recomputes; there is one slot.',
        testFunction:
          'let calls = 0; const f = memoizeOne((a) => { calls += 1; return a }); f(1); f(2); f(1); assert.strictEqual(calls, 3)',
        expectedOutput: 3,
      },
      {
        name: 'memoizeOne notices a different number of arguments',
        description: 'Calling with fewer or more arguments is a different call.',
        testFunction:
          'let calls = 0; const f = memoizeOne((...args) => { calls += 1; return args.length }); f(1); f(1, 2); assert.strictEqual(calls, 2)',
        expectedOutput: 2,
      },
      {
        name: 'memoize caches every distinct key',
        description: 'Unlike memoizeOne, earlier results survive.',
        testFunction:
          'let calls = 0; const f = memoize((n) => { calls += 1; return n * 2 }); f(1); f(2); f(1); assert.strictEqual(calls, 2)',
        expectedOutput: 2,
      },
      {
        name: 'memoize uses keyFor when given one',
        description: 'Two calls producing the same key share a result.',
        testFunction:
          "let calls = 0; const f = memoize((user) => { calls += 1; return user.name }, (user) => user.id); f({id:1,name:'a'}); f({id:1,name:'b'}); assert.strictEqual(calls, 1)",
        expectedOutput: 1,
      },
      {
        name: 'memoize exposes its cache',
        description: 'A Map on .cache, so a caller can inspect or clear it.',
        testFunction:
          'const f = memoize((n) => n * 2); f(3); assert.ok(f.cache instanceof Map); assert.strictEqual(f.cache.get(3), 6)',
        expectedOutput: 6,
      },
      {
        name: 'clearing the cache makes the next call recompute',
        description: 'The exposed Map is the real one, not a copy.',
        testFunction:
          'let calls = 0; const f = memoize((n) => { calls += 1; return n }); f(1); f.cache.clear(); f(1); assert.strictEqual(calls, 2)',
        expectedOutput: 2,
      },
      {
        name: 'memoize caches a falsy result',
        description: 'A result of 0 or undefined is still a cached result.',
        testFunction:
          "let calls = 0; const f = memoize(() => { calls += 1; return 0 }); f('k'); f('k'); assert.strictEqual(calls, 1)",
        expectedOutput: 1,
      },
    ],
  },
  hints: {
    hints: [
      {
        order: 1,
        type: 'code',
        content: 'Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(k => Object.is(a[k], b[k]))',
        showAfterAttempts: 1,
      },
      {
        order: 2,
        type: 'text',
        content:
          'memoizeOne needs to remember the previous arguments array as well as the result, and compare it element by element.',
        showAfterAttempts: 2,
      },
      {
        order: 3,
        type: 'text',
        content: 'For the falsy-result test, check cache.has(key) rather than whether the cached value is truthy.',
        showAfterAttempts: 3,
      },
      {
        order: 4,
        type: 'code',
        content: 'const wrapped = (...args) => { /* ... */ }\nwrapped.cache = cache\nreturn wrapped',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `export function shallowEqual(a, b) {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) return false
  return aKeys.every(key => Object.hasOwn(b, key) && Object.is(a[key], b[key]))
}

export function memoizeOne(fn) {
  let lastArgs = null
  let lastResult

  return (...args) => {
    const same =
      lastArgs !== null &&
      lastArgs.length === args.length &&
      lastArgs.every((arg, index) => Object.is(arg, args[index]))

    if (same) return lastResult

    lastArgs = args
    lastResult = fn(...args)
    return lastResult
  }
}

export function memoize(fn, keyFor) {
  const cache = new Map()

  const wrapped = (...args) => {
    const key = keyFor ? keyFor(...args) : args[0]
    // has() not a truthiness check, so a cached 0 or undefined still counts.
    if (cache.has(key)) return cache.get(key)

    const result = fn(...args)
    cache.set(key, result)
    return result
  }

  wrapped.cache = cache
  return wrapped
}
`,
    explanation:
      'shallowEqual compares key counts first, which rejects most mismatches immediately, then ' +
      'checks each value with Object.is. The hasOwn guard stops a key inherited from a prototype ' +
      'counting as present. memoizeOne holds one previous argument list and compares it ' +
      'element by element, so a different arity is caught by the length check before any ' +
      'element is read. memoize uses cache.has rather than testing the value, which is what ' +
      'makes a cached 0 or undefined behave correctly, and attaching the Map itself to .cache ' +
      'means a caller clearing it really does empty the cache.',
  },
}
