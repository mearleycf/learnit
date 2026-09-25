---
type: exercise
title: "State Machine Implementation"
description: "Implement a state machine using useReducer"
entry: "player.js"
minutes: 25
difficulty: medium
files:
  - name: "player.js"
    language: javascript
---

Write the reducer behind a lesson player.

There is no React here on purpose. A reducer is a pure function, so it tests without rendering
anything, and that is the point the lesson made.

The player is in one of four states: `idle`, `playing`, `paused`, `finished`. State is
`{ status, position }`, where `position` is seconds elapsed.

In **player.js**, export `initialState` and `reducer(state, action)`.

`initialState` is `{ status: 'idle', position: 0 }`.

Handle these actions:

1. `{ type: 'played' }` moves `idle` or `paused` to `playing`, keeping the position. From
   `finished` it restarts: `playing` at position `0`.
2. `{ type: 'paused' }` moves `playing` to `paused`. From anything else, nothing happens.
3. `{ type: 'scrubbed', to }` sets the position while `playing` or `paused`. Clamp it to zero
   or above. From `idle` or `finished`, nothing happens.
4. `{ type: 'ended' }` moves `playing` to `finished`. From anything else, nothing happens.

"Nothing happens" means return the state you were given, unchanged and by reference. An unknown
action does the same.

## file player.js

```javascript
export const initialState = { status: 'idle', position: 0 }

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
```

## solution

```javascript
export const initialState = { status: 'idle', position: 0 }

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
```

## explanation

Every illegal transition returns `state` itself rather than a copy, so React sees an unchanged reference and skips the re-render. The spread in the legal cases builds a new object, which is what lets React see that something did change. Math.max does the clamp in one expression. Restarting from finished is the only case that discards the position, which is why it is written out rather than folded into the spread.

## check initialState is idle at zero

The player starts idle with no elapsed time.

```javascript
assert.deepStrictEqual(initialState, { status: 'idle', position: 0 })
```

## check played starts an idle player

idle moves to playing, keeping position.

```javascript
assert.deepStrictEqual(reducer({status:'idle',position:0},{type:'played'}), {status:'playing',position:0})
```

## check played resumes from where it was paused

A paused player resumes at the same position, not from the start.

```javascript
assert.deepStrictEqual(reducer({status:'paused',position:42},{type:'played'}), {status:'playing',position:42})
```

## check played restarts a finished player

From finished, playing begins again at zero.

```javascript
assert.deepStrictEqual(reducer({status:'finished',position:99},{type:'played'}), {status:'playing',position:0})
```

## check paused only applies while playing

From playing it pauses; from idle nothing happens.

```javascript
assert.strictEqual(reducer({status:'playing',position:5},{type:'paused'}).status, 'paused'); const idle = {status:'idle',position:0}; assert.strictEqual(reducer(idle,{type:'paused'}), idle)
```

## check scrubbed moves the position while playing

The status is untouched; only the position changes.

```javascript
assert.deepStrictEqual(reducer({status:'playing',position:5},{type:'scrubbed',to:30}), {status:'playing',position:30})
```

## check scrubbed clamps a negative position to zero

Scrubbing before the start lands at zero, not a negative number.

```javascript
assert.strictEqual(reducer({status:'paused',position:5},{type:'scrubbed',to:-10}).position, 0)
```

## check scrubbed does nothing when idle

There is nothing to scrub through before playback starts.

```javascript
const idle = {status:'idle',position:0}; assert.strictEqual(reducer(idle,{type:'scrubbed',to:10}), idle)
```

## check ended only applies while playing

From playing it finishes; from paused nothing happens.

```javascript
assert.strictEqual(reducer({status:'playing',position:60},{type:'ended'}).status, 'finished'); const paused = {status:'paused',position:1}; assert.strictEqual(reducer(paused,{type:'ended'}), paused)
```

## check an unknown action returns the same object

Unchanged by reference, not a copy, so React sees nothing changed.

```javascript
const s = {status:'playing',position:3}; assert.strictEqual(reducer(s,{type:'nonsense'}), s)
```

## check the reducer never mutates the state it is given

The original object must be untouched after a transition.

```javascript
const s = {status:'idle',position:0}; reducer(s,{type:'played'}); assert.deepStrictEqual(s, {status:'idle',position:0})
```

## hint after 1

```javascript
case 'played': return { status: 'playing', position: state.status === 'finished' ? 0 : state.position }
```

## hint after 2

For an illegal transition, `return state` rather than building an identical object. Two checks compare by reference.

## hint after 3

```javascript
Math.max(0, action.to)
```

## hint after 4

Spread the old state into the new one so you never edit the object you were handed.
