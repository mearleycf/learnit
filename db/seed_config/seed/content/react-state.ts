import type { ExerciseConfig } from '../../types/seed-types'

/**
 * Authored content for Advanced React Development, chapter 2.
 *
 * Every exercise here is plain JavaScript with no React import. That is not a
 * workaround for the runner: a reducer and a store are pure functions, and
 * being able to test them without mounting anything is the chapter's point.
 */

export const complexStateLesson = {
  markdown: `\`useState\` is the right tool until it is not. This chapter is about noticing the moment it
stops paying and what to reach for instead.

## The signal that you have outgrown useState

One piece of state is fine. The trouble starts when several pieces have to change together.

\`\`\`javascript
const [status, setStatus] = useState('idle')
const [data, setData] = useState(null)
const [error, setError] = useState(null)
\`\`\`

Every transition now has to remember to update all three. Forget one and you get a state the
interface should never show: \`status === 'error'\` with a stale \`data\` still on screen, or
\`loading\` with an old error underneath it.

The problem is not the number of variables. It is that **the combinations are not all legal**,
and nothing stops you reaching an illegal one.

## Make illegal states unrepresentable

Rewrite the three as one value whose shape depends on the status:

\`\`\`javascript
const [request, setRequest] = useState({ status: 'idle' })

// then one of:
{ status: 'loading' }
{ status: 'success', data }
{ status: 'error', error }
\`\`\`

Now "error with stale data" cannot be written down. That is a better guarantee than remembering
to clear a variable, because it does not depend on anyone remembering.

This is the same discriminated union you met in the JavaScript course, applied to state.

## Derived state is not state

If a value can be computed from what you already have, computing it is almost always better than
storing it.

\`\`\`javascript
// Storing it: two things to keep in step.
const [lessons, setLessons] = useState([])
const [doneCount, setDoneCount] = useState(0)

// Computing it: one source of truth.
const [lessons, setLessons] = useState([])
const doneCount = lessons.filter(lesson => lesson.done).length
\`\`\`

The stored version has a bug waiting in it: any code path that updates \`lessons\` without
updating \`doneCount\` puts them out of step. The computed version cannot go wrong, and the
recalculation is free at any size you will meet in a component.

Reach for \`useMemo\` only when you have measured the calculation and it is genuinely slow.
Wrapping a \`filter\` over twelve items is noise.

## Where state should live

Put state in the lowest component that needs it. Move it up only when a second component needs
the same value.

Lifting state too eagerly is the more common mistake. It makes a parent re-render for changes it
does not care about, and it turns a local concern into something several files know about.

## When a reducer earns its place

Reach for \`useReducer\` when:

- Several values change together on one event.
- The next state depends on the current one in a way that is awkward inline.
- The same transition happens from more than one place.
- You want to test the transitions without rendering anything.

That last one is the underrated reason, and the next section is about it.`,
  references: ['https://react.dev/learn/choosing-the-state-structure', 'https://react.dev/reference/react/useReducer'],
}

export const useReducerLesson = {
  markdown: `A reducer is a function that takes the current state and an action, and returns the next state.

\`\`\`javascript
function reducer(state, action) {
  switch (action.type) {
    case 'started':
      return { status: 'loading' }
    case 'succeeded':
      return { status: 'success', data: action.data }
    case 'failed':
      return { status: 'error', error: action.error }
    default:
      return state
  }
}
\`\`\`

That is all it is. No React in sight, which is the first thing worth noticing.

## Why that matters

Because a reducer is an ordinary function, you can test it like one:

\`\`\`javascript
reducer({ status: 'idle' }, { type: 'started' })
// { status: 'loading' }
\`\`\`

No component, no rendering, no waiting for an effect. The logic that is hardest to get right
becomes the easiest thing in the codebase to check. The exercises in this chapter do exactly
that, and none of them import React.

## The rules a reducer has to keep

**It must be pure.** Same state and action in, same state out, every time. No fetching, no
\`Math.random()\`, no reading the clock, no writing to anything outside itself. React may call
your reducer more than once for the same action in development, deliberately, to catch this.

**It must not mutate.** Return a new object rather than editing the one you were given.

\`\`\`javascript
// Wrong: React cannot tell anything changed.
state.items.push(item)
return state

// Right.
return { ...state, items: [...state.items, item] }
\`\`\`

The wrong version often appears to work, then fails to re-render for reasons that look like
magic. It is not magic: React compares by reference, and the reference did not change.

**Unknown actions return the state unchanged.** A \`default\` that throws is defensible, and a
\`default\` that silently returns something new is not.

## Actions describe what happened

Name actions after the event, not the state change.

\`\`\`javascript
// Says what happened. One action, several fields updated.
{ type: 'submitted' }

// Says how to change the state. The reducer is now a setter with extra steps.
{ type: 'setStatusToLoading' }
\`\`\`

The first survives a change to how loading works. The second has to be renamed when it does.

## Reducers compose

A reducer can hand part of the state to another reducer, which is how a large one stays
readable:

\`\`\`javascript
function appReducer(state, action) {
  return {
    player: playerReducer(state.player, action),
    notes: notesReducer(state.notes, action),
  }
}
\`\`\`

Both see every action and each ignores what it does not recognise.

## A reducer is a state machine

Once transitions live in one function you can ask a question you could not ask before: which
transitions are legal from here?

\`\`\`javascript
case 'paused':
  // Only meaningful while playing. From 'idle' it is nonsense.
  return state.status === 'playing' ? { ...state, status: 'paused' } : state
\`\`\`

Returning the state unchanged for an impossible transition is usually better than throwing.
The interface stays on its feet, and the bug shows up as "nothing happened" rather than a crash.

The first exercise in this chapter builds one of these.`,
  references: [
    'https://react.dev/learn/extracting-state-logic-into-a-reducer',
    'https://react.dev/reference/react/useReducer#i-dispatched-an-action-but-logging-gives-me-the-old-state-value',
  ],
}

export const stateManagementRecap = {
  summary:
    'Reach for a reducer when several values change together, when a transition happens from ' +
    'more than one place, or when you want to test the logic without rendering. A reducer is a ' +
    'pure function of state and action, which is what makes it testable and what makes the ' +
    'purity rules non-negotiable.',
  key_points: [
    'Several `useState` calls that must change together is the signal to switch to a reducer.',
    'Model state so illegal combinations cannot be written down, rather than remembering to clear fields.',
    'Anything computable from existing state should be computed, not stored.',
    'Keep state in the lowest component that needs it; lift only when something else needs it too.',
    'A reducer must be pure: no fetching, no randomness, no clock, no outside writes.',
    'Never mutate the state you were handed. React compares by reference.',
    'Name actions after what happened, not after the change you want made.',
    'Return the state unchanged for an unknown or illegal action.',
    'Because reducers are ordinary functions, they test without React.',
  ],
}

export const stateMachineExercise: ExerciseConfig = {
  seedSequence: 1,
  exercise_display_number: 1,
  estimated_time_minutes: 25,
  difficulty: 'medium',
  instructions: `Write the reducer behind a lesson player.

There is no React here on purpose. A reducer is a pure function, so it tests without rendering
anything, and that is the point the lesson made.

The player is in one of four states: \`idle\`, \`playing\`, \`paused\`, \`finished\`. State is
\`{ status, position }\`, where \`position\` is seconds elapsed.

In **player.js**, export \`initialState\` and \`reducer(state, action)\`.

\`initialState\` is \`{ status: 'idle', position: 0 }\`.

Handle these actions:

1. \`{ type: 'played' }\` moves \`idle\` or \`paused\` to \`playing\`, keeping the position. From
   \`finished\` it restarts: \`playing\` at position \`0\`.
2. \`{ type: 'paused' }\` moves \`playing\` to \`paused\`. From anything else, nothing happens.
3. \`{ type: 'scrubbed', to }\` sets the position while \`playing\` or \`paused\`. Clamp it to zero
   or above. From \`idle\` or \`finished\`, nothing happens.
4. \`{ type: 'ended' }\` moves \`playing\` to \`finished\`. From anything else, nothing happens.

"Nothing happens" means return the state you were given, unchanged and by reference. An unknown
action does the same.`,
  code_files: {
    files: [
      {
        filename: 'player.js',
        language: 'javascript',
        content: `export const initialState = { status: 'idle', position: 0 }

export function reducer(state, action) {
  switch (action.type) {
    // 1. played: idle or paused resume; finished restarts at 0.

    // 2. paused: only from playing.

    // 3. scrubbed: only while playing or paused. Clamp to >= 0.

    // 4. ended: only from playing.

    default:
      return state
  }
}
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'player.js',
  },
  tests: {
    tests: [
      {
        name: 'initialState is idle at zero',
        description: 'The player starts idle with no elapsed time.',
        testFunction: "assert.deepStrictEqual(initialState, { status: 'idle', position: 0 })",
        expectedOutput: { status: 'idle', position: 0 },
      },
      {
        name: 'played starts an idle player',
        description: 'idle moves to playing, keeping position.',
        testFunction:
          "assert.deepStrictEqual(reducer({status:'idle',position:0},{type:'played'}), {status:'playing',position:0})",
        expectedOutput: { status: 'playing', position: 0 },
      },
      {
        name: 'played resumes from where it was paused',
        description: 'A paused player resumes at the same position, not from the start.',
        testFunction:
          "assert.deepStrictEqual(reducer({status:'paused',position:42},{type:'played'}), {status:'playing',position:42})",
        expectedOutput: { status: 'playing', position: 42 },
      },
      {
        name: 'played restarts a finished player',
        description: 'From finished, playing begins again at zero.',
        testFunction:
          "assert.deepStrictEqual(reducer({status:'finished',position:99},{type:'played'}), {status:'playing',position:0})",
        expectedOutput: { status: 'playing', position: 0 },
      },
      {
        name: 'paused only applies while playing',
        description: 'From playing it pauses; from idle nothing happens.',
        testFunction:
          "assert.strictEqual(reducer({status:'playing',position:5},{type:'paused'}).status, 'paused'); const idle = {status:'idle',position:0}; assert.strictEqual(reducer(idle,{type:'paused'}), idle)",
        expectedOutput: 'paused',
      },
      {
        name: 'scrubbed moves the position while playing',
        description: 'The status is untouched; only the position changes.',
        testFunction:
          "assert.deepStrictEqual(reducer({status:'playing',position:5},{type:'scrubbed',to:30}), {status:'playing',position:30})",
        expectedOutput: { status: 'playing', position: 30 },
      },
      {
        name: 'scrubbed clamps a negative position to zero',
        description: 'Scrubbing before the start lands at zero, not a negative number.',
        testFunction: "assert.strictEqual(reducer({status:'paused',position:5},{type:'scrubbed',to:-10}).position, 0)",
        expectedOutput: 0,
      },
      {
        name: 'scrubbed does nothing when idle',
        description: 'There is nothing to scrub through before playback starts.',
        testFunction:
          "const idle = {status:'idle',position:0}; assert.strictEqual(reducer(idle,{type:'scrubbed',to:10}), idle)",
        expectedOutput: 'unchanged',
      },
      {
        name: 'ended only applies while playing',
        description: 'From playing it finishes; from paused nothing happens.',
        testFunction:
          "assert.strictEqual(reducer({status:'playing',position:60},{type:'ended'}).status, 'finished'); const paused = {status:'paused',position:1}; assert.strictEqual(reducer(paused,{type:'ended'}), paused)",
        expectedOutput: 'finished',
      },
      {
        name: 'an unknown action returns the same object',
        description: 'Unchanged by reference, not a copy, so React sees nothing changed.',
        testFunction: "const s = {status:'playing',position:3}; assert.strictEqual(reducer(s,{type:'nonsense'}), s)",
        expectedOutput: 'unchanged',
      },
      {
        name: 'the reducer never mutates the state it is given',
        description: 'The original object must be untouched after a transition.',
        testFunction:
          "const s = {status:'idle',position:0}; reducer(s,{type:'played'}); assert.deepStrictEqual(s, {status:'idle',position:0})",
        expectedOutput: { status: 'idle', position: 0 },
      },
    ],
  },
  hints: {
    hints: [
      {
        order: 1,
        type: 'code',
        content:
          "case 'played': return { status: 'playing', position: state.status === 'finished' ? 0 : state.position }",
        showAfterAttempts: 1,
      },
      {
        order: 2,
        type: 'text',
        content:
          'For an illegal transition, `return state` rather than building an identical object. Two checks compare by reference.',
        showAfterAttempts: 2,
      },
      {
        order: 3,
        type: 'code',
        content: 'Math.max(0, action.to)',
        showAfterAttempts: 3,
      },
      {
        order: 4,
        type: 'text',
        content: 'Spread the old state into the new one so you never edit the object you were handed.',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `export const initialState = { status: 'idle', position: 0 }

export function reducer(state, action) {
  switch (action.type) {
    case 'played':
      if (state.status === 'playing') return state
      return { status: 'playing', position: state.status === 'finished' ? 0 : state.position }

    case 'paused':
      return state.status === 'playing' ? { ...state, status: 'paused' } : state

    case 'scrubbed':
      if (state.status !== 'playing' && state.status !== 'paused') return state
      return { ...state, position: Math.max(0, action.to) }

    case 'ended':
      return state.status === 'playing' ? { ...state, status: 'finished' } : state

    default:
      return state
  }
}
`,
    explanation:
      'Every illegal transition returns `state` itself rather than a copy, so React sees an ' +
      'unchanged reference and skips the re-render. The spread in the legal cases builds a new ' +
      'object, which is what lets React see that something did change. Math.max does the clamp ' +
      'in one expression. Restarting from finished is the only case that discards the position, ' +
      'which is why it is written out rather than folded into the spread.',
  },
}

export const storeExercise: ExerciseConfig = {
  seedSequence: 2,
  exercise_display_number: 2,
  estimated_time_minutes: 25,
  difficulty: 'hard',
  instructions: `Build the store that sits under a reducer.

\`useReducer\` gives you dispatch and a re-render. Outside a component you need the same thing
plus a way to subscribe. That is about thirty lines, and writing it once explains every state
library you will meet.

In **store.js**, export \`createStore(reducer, initialState)\` returning an object with:

1. \`getState()\` returning the current state.
2. \`dispatch(action)\` running the reducer, storing the result, and notifying subscribers.
   Return the new state.
3. \`subscribe(listener)\` registering a function called after every dispatch, with the new
   state. It returns an **unsubscribe** function.

Three details that matter:

- When the reducer returns the same state by reference, **do not notify anyone**. That is the
  optimisation the previous exercise was setting up.
- Unsubscribing during a notification must not skip another listener. Iterate over a copy.
- The same listener subscribed twice is called twice, and one unsubscribe removes one of them.`,
  code_files: {
    files: [
      {
        filename: 'store.js',
        language: 'javascript',
        content: `export function createStore(reducer, initialState) {
  // Hold the current state and the listeners here.

  return {
    getState() {},

    // Run the reducer, keep the result, notify, return the new state.
    // Skip the notification when the state did not actually change.
    dispatch(action) {},

    // Register a listener, and return a function that removes it.
    subscribe(listener) {},
  }
}
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'store.js',
  },
  tests: {
    tests: [
      {
        name: 'getState returns the initial state',
        description: 'Before any dispatch, the store holds what it was given.',
        testFunction:
          'const s = createStore((x) => x, { count: 0 }); assert.deepStrictEqual(s.getState(), { count: 0 })',
        expectedOutput: { count: 0 },
      },
      {
        name: 'dispatch runs the reducer and stores the result',
        description: 'The state after dispatch is whatever the reducer returned.',
        testFunction:
          "const r = (state, a) => a.type === 'inc' ? { count: state.count + 1 } : state; const s = createStore(r, { count: 0 }); s.dispatch({type:'inc'}); assert.strictEqual(s.getState().count, 1)",
        expectedOutput: 1,
      },
      {
        name: 'dispatch returns the new state',
        description: 'The caller gets the result without a second getState call.',
        testFunction:
          "const r = (state, a) => a.type === 'inc' ? { count: state.count + 1 } : state; const s = createStore(r, { count: 0 }); assert.strictEqual(s.dispatch({type:'inc'}).count, 1)",
        expectedOutput: 1,
      },
      {
        name: 'subscribers are called with the new state',
        description: 'Every listener hears about the change.',
        testFunction:
          "const r = (state, a) => ({ count: state.count + 1 }); const s = createStore(r, { count: 0 }); let seen = null; s.subscribe(next => { seen = next }); s.dispatch({type:'inc'}); assert.strictEqual(seen.count, 1)",
        expectedOutput: 1,
      },
      {
        name: 'no notification when the state did not change',
        description: 'A reducer returning the same reference means nothing happened.',
        testFunction:
          "const r = (state) => state; const s = createStore(r, { count: 0 }); let calls = 0; s.subscribe(() => { calls += 1 }); s.dispatch({type:'nothing'}); assert.strictEqual(calls, 0)",
        expectedOutput: 0,
      },
      {
        name: 'unsubscribe stops the listener',
        description: 'The function subscribe returns removes that listener.',
        testFunction:
          'const r = (state) => ({ n: (state.n ?? 0) + 1 }); const s = createStore(r, {}); let calls = 0; const off = s.subscribe(() => { calls += 1 }); s.dispatch({}); off(); s.dispatch({}); assert.strictEqual(calls, 1)',
        expectedOutput: 1,
      },
      {
        name: 'every subscriber is called',
        description: 'Two listeners both hear the same dispatch.',
        testFunction:
          'const r = (state) => ({ n: (state.n ?? 0) + 1 }); const s = createStore(r, {}); let a = 0, b = 0; s.subscribe(() => { a += 1 }); s.subscribe(() => { b += 1 }); s.dispatch({}); assert.strictEqual(a + b, 2)',
        expectedOutput: 2,
      },
      {
        name: 'unsubscribing mid-notification does not skip anyone',
        description: 'A listener that removes itself must not stop the next one running.',
        testFunction:
          'const r = (state) => ({ n: (state.n ?? 0) + 1 }); const s = createStore(r, {}); let second = 0; const off = s.subscribe(() => off()); s.subscribe(() => { second += 1 }); s.dispatch({}); assert.strictEqual(second, 1)',
        expectedOutput: 1,
      },
      {
        name: 'the same listener twice is called twice',
        description: 'Subscriptions are a list, not a set.',
        testFunction:
          'const r = (state) => ({ n: (state.n ?? 0) + 1 }); const s = createStore(r, {}); let calls = 0; const fn = () => { calls += 1 }; s.subscribe(fn); s.subscribe(fn); s.dispatch({}); assert.strictEqual(calls, 2)',
        expectedOutput: 2,
      },
    ],
  },
  hints: {
    hints: [
      {
        order: 1,
        type: 'code',
        content: 'let state = initialState\nconst listeners = []',
        showAfterAttempts: 1,
      },
      {
        order: 2,
        type: 'text',
        content: 'Compare with === before notifying. A reducer that returns its argument means nothing changed.',
        showAfterAttempts: 2,
      },
      {
        order: 3,
        type: 'code',
        content: 'for (const listener of [...listeners]) listener(state)',
        showAfterAttempts: 3,
      },
      {
        order: 4,
        type: 'text',
        content: 'Unsubscribe by splicing at indexOf, so a duplicate listener only loses one registration.',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `export function createStore(reducer, initialState) {
  let state = initialState
  const listeners = []

  return {
    getState() {
      return state
    },

    dispatch(action) {
      const next = reducer(state, action)
      if (next === state) return state

      state = next
      // Iterate a copy: a listener may unsubscribe while we are notifying.
      for (const listener of [...listeners]) listener(state)
      return state
    },

    subscribe(listener) {
      listeners.push(listener)
      let removed = false
      return () => {
        if (removed) return
        removed = true
        listeners.splice(listeners.indexOf(listener), 1)
      }
    },
  }
}
`,
    explanation:
      'The `next === state` check is what makes an ignored action free. Notifying over a copy of ' +
      'the array is the fix for a listener that unsubscribes mid-notification: splicing the live ' +
      'array would shift the index and skip the next listener. indexOf removes one registration, ' +
      'so the same function subscribed twice keeps its other one. The `removed` flag stops a ' +
      'second call to the same unsubscribe from removing somebody else.',
  },
}

export const syncExercise: ExerciseConfig = {
  seedSequence: 3,
  exercise_display_number: 3,
  estimated_time_minutes: 20,
  difficulty: 'medium',
  instructions: `Reconcile local edits with what the server says.

An offline-capable app has two versions of the truth: what the student changed locally and what
came back from the server. Merging them is the awkward part, and it is pure logic.

Each record is \`{ id, updatedAt, ...fields }\`. In **sync.js**, export:

1. \`merge(local, remote)\` returning one array. For an id in both, keep whichever has the later
   \`updatedAt\`; on an exact tie keep the local one, because the student is looking at it.
   Records in only one side are kept as they are. Sort the result by \`id\`.
2. \`conflicts(local, remote)\` returning the ids present in both where \`updatedAt\` differs,
   sorted. These are the ones worth telling someone about.
3. \`pending(local, remote)\` returning the local records that are newer than their remote
   counterpart, or absent from remote entirely. These still need uploading. Sort by \`id\`.`,
  code_files: {
    files: [
      {
        filename: 'sync.js',
        language: 'javascript',
        content: `// 1. One array, newest per id wins, local wins an exact tie. Sorted by id.
export function merge(local, remote) {}

// 2. Ids in both sides whose updatedAt differs. Sorted.
export function conflicts(local, remote) {}

// 3. Local records newer than remote, or missing from it. Sorted by id.
export function pending(local, remote) {}
`,
        isReadOnly: false,
        isHidden: false,
      },
    ],
    defaultView: 'sync.js',
  },
  tests: {
    tests: [
      {
        name: 'merge keeps the newer of two versions',
        description: 'The higher updatedAt wins.',
        testFunction:
          "assert.deepStrictEqual(merge([{id:'a',updatedAt:2,v:'new'}], [{id:'a',updatedAt:1,v:'old'}]), [{id:'a',updatedAt:2,v:'new'}])",
        expectedOutput: [{ id: 'a', updatedAt: 2, v: 'new' }],
      },
      {
        name: 'merge prefers local on an exact tie',
        description: 'Equal timestamps mean the version in front of the student wins.',
        testFunction:
          "assert.strictEqual(merge([{id:'a',updatedAt:1,v:'local'}], [{id:'a',updatedAt:1,v:'remote'}])[0].v, 'local')",
        expectedOutput: 'local',
      },
      {
        name: 'merge keeps records that exist on one side only',
        description: 'Nothing is dropped just because the other side has not seen it.',
        testFunction:
          "assert.deepStrictEqual(merge([{id:'a',updatedAt:1}], [{id:'b',updatedAt:1}]).map(r => r.id), ['a','b'])",
        expectedOutput: ['a', 'b'],
      },
      {
        name: 'merge sorts by id',
        description: 'Output order does not depend on input order.',
        testFunction:
          "assert.deepStrictEqual(merge([{id:'z',updatedAt:1}], [{id:'a',updatedAt:1}]).map(r => r.id), ['a','z'])",
        expectedOutput: ['a', 'z'],
      },
      {
        name: 'merge handles two empty sides',
        description: 'Nothing in, empty array out.',
        testFunction: 'assert.deepStrictEqual(merge([], []), [])',
        expectedOutput: [],
      },
      {
        name: 'conflicts finds ids that differ on both sides',
        description: 'Present in both with different timestamps.',
        testFunction:
          "assert.deepStrictEqual(conflicts([{id:'a',updatedAt:2},{id:'b',updatedAt:1}], [{id:'a',updatedAt:1},{id:'b',updatedAt:1}]), ['a'])",
        expectedOutput: ['a'],
      },
      {
        name: 'conflicts ignores records on one side only',
        description: 'A record the other side has never seen is not a conflict.',
        testFunction: "assert.deepStrictEqual(conflicts([{id:'a',updatedAt:1}], [{id:'b',updatedAt:9}]), [])",
        expectedOutput: [],
      },
      {
        name: 'pending finds local records newer than remote',
        description: 'These still need uploading.',
        testFunction:
          "assert.deepStrictEqual(pending([{id:'a',updatedAt:2}], [{id:'a',updatedAt:1}]).map(r => r.id), ['a'])",
        expectedOutput: ['a'],
      },
      {
        name: 'pending includes local records remote has never seen',
        description: 'A brand new local record counts as pending.',
        testFunction: "assert.deepStrictEqual(pending([{id:'new',updatedAt:1}], []).map(r => r.id), ['new'])",
        expectedOutput: ['new'],
      },
      {
        name: 'pending excludes records the remote already has at the same time',
        description: 'Nothing to upload when both sides agree.',
        testFunction: "assert.deepStrictEqual(pending([{id:'a',updatedAt:1}], [{id:'a',updatedAt:1}]), [])",
        expectedOutput: [],
      },
    ],
  },
  hints: {
    hints: [
      {
        order: 1,
        type: 'code',
        content: 'const byId = new Map(remote.map(r => [r.id, r]))',
        showAfterAttempts: 1,
      },
      {
        order: 2,
        type: 'text',
        content: 'For merge, start from a Map of remote, then overwrite with any local record that is newer or equal.',
        showAfterAttempts: 2,
      },
      {
        order: 3,
        type: 'code',
        content: '[...map.values()].toSorted((a, b) => a.id.localeCompare(b.id))',
        showAfterAttempts: 3,
      },
      {
        order: 4,
        type: 'text',
        content: 'pending is local filtered by: no remote counterpart, or a strictly greater updatedAt.',
        showAfterAttempts: 4,
      },
    ],
  },
  default_solution: {
    content: `const index = records => new Map(records.map(record => [record.id, record]))
const byId = (a, b) => a.id.localeCompare(b.id)

export function merge(local, remote) {
  const merged = index(remote)

  for (const record of local) {
    const other = merged.get(record.id)
    // >= because an exact tie goes to local.
    if (!other || record.updatedAt >= other.updatedAt) merged.set(record.id, record)
  }

  return [...merged.values()].toSorted(byId)
}

export function conflicts(local, remote) {
  const remoteById = index(remote)

  return local
    .filter(record => {
      const other = remoteById.get(record.id)
      return other !== undefined && other.updatedAt !== record.updatedAt
    })
    .map(record => record.id)
    .toSorted()
}

export function pending(local, remote) {
  const remoteById = index(remote)

  return local
    .filter(record => {
      const other = remoteById.get(record.id)
      return other === undefined || record.updatedAt > other.updatedAt
    })
    .toSorted(byId)
}
`,
    explanation:
      'Indexing remote by id turns every lookup into one operation instead of a scan, which is ' +
      'the whole trick in all three functions. merge starts from remote and lets local overwrite ' +
      'on `>=`, so the tie rule falls out of the comparison rather than needing a special case. ' +
      'conflicts uses `!==` rather than comparing magnitudes, because either side being ahead is ' +
      'still a disagreement. pending uses a strict `>`, since equal timestamps mean there is ' +
      'nothing to send.',
  },
}
