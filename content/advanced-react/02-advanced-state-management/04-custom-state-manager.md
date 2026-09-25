---
type: exercise
title: "Custom State Manager"
description: "Build a custom state management solution"
entry: "store.js"
minutes: 25
difficulty: hard
number: 2
files:
  - name: "store.js"
    language: javascript
---

Build the store that sits under a reducer.

`useReducer` gives you dispatch and a re-render. Outside a component you need the same thing
plus a way to subscribe. That is about thirty lines, and writing it once explains every state
library you will meet.

In **store.js**, export `createStore(reducer, initialState)` returning an object with:

1. `getState()` returning the current state.
2. `dispatch(action)` running the reducer, storing the result, and notifying subscribers.
   Return the new state.
3. `subscribe(listener)` registering a function called after every dispatch, with the new
   state. It returns an **unsubscribe** function.

Three details that matter:

- When the reducer returns the same state by reference, **do not notify anyone**. That is the
  optimisation the previous exercise was setting up.
- Unsubscribing during a notification must not skip another listener. Iterate over a copy.
- The same listener subscribed twice is called twice, and one unsubscribe removes one of them.

## file store.js

```javascript
export function createStore(reducer, initialState) {
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
```

## solution

```javascript
export function createStore(reducer, initialState) {
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
```

## explanation

The `next === state` check is what makes an ignored action free. Notifying over a copy of the array is the fix for a listener that unsubscribes mid-notification: splicing the live array would shift the index and skip the next listener. indexOf removes one registration, so the same function subscribed twice keeps its other one. The `removed` flag stops a second call to the same unsubscribe from removing somebody else.

## check getState returns the initial state

Before any dispatch, the store holds what it was given.

```javascript
const s = createStore((x) => x, { count: 0 }); assert.deepStrictEqual(s.getState(), { count: 0 })
```

## check dispatch runs the reducer and stores the result

The state after dispatch is whatever the reducer returned.

```javascript
const r = (state, a) => a.type === 'inc' ? { count: state.count + 1 } : state; const s = createStore(r, { count: 0 }); s.dispatch({type:'inc'}); assert.strictEqual(s.getState().count, 1)
```

## check dispatch returns the new state

The caller gets the result without a second getState call.

```javascript
const r = (state, a) => a.type === 'inc' ? { count: state.count + 1 } : state; const s = createStore(r, { count: 0 }); assert.strictEqual(s.dispatch({type:'inc'}).count, 1)
```

## check subscribers are called with the new state

Every listener hears about the change.

```javascript
const r = (state, a) => ({ count: state.count + 1 }); const s = createStore(r, { count: 0 }); let seen = null; s.subscribe(next => { seen = next }); s.dispatch({type:'inc'}); assert.strictEqual(seen.count, 1)
```

## check no notification when the state did not change

A reducer returning the same reference means nothing happened.

```javascript
const r = (state) => state; const s = createStore(r, { count: 0 }); let calls = 0; s.subscribe(() => { calls += 1 }); s.dispatch({type:'nothing'}); assert.strictEqual(calls, 0)
```

## check unsubscribe stops the listener

The function subscribe returns removes that listener.

```javascript
const r = (state) => ({ n: (state.n ?? 0) + 1 }); const s = createStore(r, {}); let calls = 0; const off = s.subscribe(() => { calls += 1 }); s.dispatch({}); off(); s.dispatch({}); assert.strictEqual(calls, 1)
```

## check every subscriber is called

Two listeners both hear the same dispatch.

```javascript
const r = (state) => ({ n: (state.n ?? 0) + 1 }); const s = createStore(r, {}); let a = 0, b = 0; s.subscribe(() => { a += 1 }); s.subscribe(() => { b += 1 }); s.dispatch({}); assert.strictEqual(a + b, 2)
```

## check unsubscribing mid-notification does not skip anyone

A listener that removes itself must not stop the next one running.

```javascript
const r = (state) => ({ n: (state.n ?? 0) + 1 }); const s = createStore(r, {}); let second = 0; const off = s.subscribe(() => off()); s.subscribe(() => { second += 1 }); s.dispatch({}); assert.strictEqual(second, 1)
```

## check the same listener twice is called twice

Subscriptions are a list, not a set.

```javascript
const r = (state) => ({ n: (state.n ?? 0) + 1 }); const s = createStore(r, {}); let calls = 0; const fn = () => { calls += 1 }; s.subscribe(fn); s.subscribe(fn); s.dispatch({}); assert.strictEqual(calls, 2)
```

## hint after 1

```javascript
let state = initialState
const listeners = []
```

## hint after 2

Compare with === before notifying. A reducer that returns its argument means nothing changed.

## hint after 3

```javascript
for (const listener of [...listeners]) listener(state)
```

## hint after 4

Unsubscribe by splicing at indexOf, so a duplicate listener only loses one registration.
