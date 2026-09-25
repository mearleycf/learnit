---
type: lesson
title: "Complex State Patterns"
description: "Understanding advanced state management patterns"
references:
  - "https://react.dev/learn/choosing-the-state-structure"
  - "https://react.dev/reference/react/useReducer"
---

`useState` is the right tool until it is not. This chapter is about noticing the moment it
stops paying and what to reach for instead.

## The signal that you have outgrown useState

One piece of state is fine. The trouble starts when several pieces have to change together.

```javascript
const [status, setStatus] = useState('idle')
const [data, setData] = useState(null)
const [error, setError] = useState(null)
```

Every transition now has to remember to update all three. Forget one and you get a state the
interface should never show: `status === 'error'` with a stale `data` still on screen, or
`loading` with an old error underneath it.

The problem is not the number of variables. It is that **the combinations are not all legal**,
and nothing stops you reaching an illegal one.

## Make illegal states unrepresentable

Rewrite the three as one value whose shape depends on the status:

```javascript
const [request, setRequest] = useState({ status: 'idle' })

// then one of:
{ status: 'loading' }
{ status: 'success', data }
{ status: 'error', error }
```

Now "error with stale data" cannot be written down. That is a better guarantee than remembering
to clear a variable, because it does not depend on anyone remembering.

This is the same discriminated union you met in the JavaScript course, applied to state.

## Derived state is not state

If a value can be computed from what you already have, computing it is almost always better than
storing it.

```javascript
// Storing it: two things to keep in step.
const [lessons, setLessons] = useState([])
const [doneCount, setDoneCount] = useState(0)

// Computing it: one source of truth.
const [lessons, setLessons] = useState([])
const doneCount = lessons.filter(lesson => lesson.done).length
```

The stored version has a bug waiting in it: any code path that updates `lessons` without
updating `doneCount` puts them out of step. The computed version cannot go wrong, and the
recalculation is free at any size you will meet in a component.

Reach for `useMemo` only when you have measured the calculation and it is genuinely slow.
Wrapping a `filter` over twelve items is noise.

## Where state should live

Put state in the lowest component that needs it. Move it up only when a second component needs
the same value.

Lifting state too eagerly is the more common mistake. It makes a parent re-render for changes it
does not care about, and it turns a local concern into something several files know about.

## When a reducer earns its place

Reach for `useReducer` when:

- Several values change together on one event.
- The next state depends on the current one in a way that is awkward inline.
- The same transition happens from more than one place.
- You want to test the transitions without rendering anything.

That last one is the underrated reason, and the next section is about it.
