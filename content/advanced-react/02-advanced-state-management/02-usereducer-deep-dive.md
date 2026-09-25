---
type: lesson
title: "useReducer Deep Dive"
description: "Advanced usage of useReducer hook"
references:
  - "https://react.dev/learn/extracting-state-logic-into-a-reducer"
  - "https://react.dev/reference/react/useReducer#i-dispatched-an-action-but-logging-gives-me-the-old-state-value"
---

A reducer is a function that takes the current state and an action, and returns the next state.

```javascript
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
```

That is all it is. No React in sight, which is the first thing worth noticing.

## Why that matters

Because a reducer is an ordinary function, you can test it like one:

```javascript
reducer({ status: 'idle' }, { type: 'started' })
// { status: 'loading' }
```

No component, no rendering, no waiting for an effect. The logic that is hardest to get right
becomes the easiest thing in the codebase to check. The exercises in this chapter do exactly
that, and none of them import React.

## The rules a reducer has to keep

**It must be pure.** Same state and action in, same state out, every time. No fetching, no
`Math.random()`, no reading the clock, no writing to anything outside itself. React may call
your reducer more than once for the same action in development, deliberately, to catch this.

**It must not mutate.** Return a new object rather than editing the one you were given.

```javascript
// Wrong: React cannot tell anything changed.
state.items.push(item)
return state

// Right.
return { ...state, items: [...state.items, item] }
```

The wrong version often appears to work, then fails to re-render for reasons that look like
magic. It is not magic: React compares by reference, and the reference did not change.

**Unknown actions return the state unchanged.** A `default` that throws is defensible, and a
`default` that silently returns something new is not.

## Actions describe what happened

Name actions after the event, not the state change.

```javascript
// Says what happened. One action, several fields updated.
{ type: 'submitted' }

// Says how to change the state. The reducer is now a setter with extra steps.
{ type: 'setStatusToLoading' }
```

The first survives a change to how loading works. The second has to be renamed when it does.

## Reducers compose

A reducer can hand part of the state to another reducer, which is how a large one stays
readable:

```javascript
function appReducer(state, action) {
  return {
    player: playerReducer(state.player, action),
    notes: notesReducer(state.notes, action),
  }
}
```

Both see every action and each ignores what it does not recognise.

## A reducer is a state machine

Once transitions live in one function you can ask a question you could not ask before: which
transitions are legal from here?

```javascript
case 'paused':
  // Only meaningful while playing. From 'idle' it is nonsense.
  return state.status === 'playing' ? { ...state, status: 'paused' } : state
```

Returning the state unchanged for an impossible transition is usually better than throwing.
The interface stays on its feet, and the bug shows up as "nothing happened" rather than a crash.

The first exercise in this chapter builds one of these.
