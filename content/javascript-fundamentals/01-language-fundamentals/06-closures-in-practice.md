---
type: exercise
title: "Closures in Practice"
description: "Build a counter, a memoiser and a once-only function out of captured scope"
entry: closures.js
minutes: 20
difficulty: medium
files:
  - name: closures.js
    language: javascript
---

Three functions that each return a function, and keep their state in the scope they close over.
No classes, no module-level variables: every call to the outer function must produce independent
state.

1. `makeCounter(start)` returns an object with `next()`, which adds one and returns the new
   value, and `reset()`, which puts the count back to `start`. `start` defaults to `0`.
2. `memoise(fn)` returns a function taking one argument. The first call with a given argument
   calls `fn`; later calls with the same argument return the stored result without calling it.
   A result of `undefined` is still a result, and must be cached too.
3. `once(fn)` returns a function that calls `fn` the first time, passing its arguments through,
   and on every later call returns that first result without calling `fn` again.

## file closures.js

```javascript
// 1. { next, reset }. next() adds one and returns it; reset() goes back to start.
export function makeCounter(start = 0) {
  return {
    next() {},
    reset() {},
  }
}

// 2. Calls fn once per distinct argument, then returns the stored result.
export function memoise(fn) {
  return arg => fn(arg)
}

// 3. Calls fn the first time only. Every later call returns the first result.
export function once(fn) {
  return (...args) => fn(...args)
}
```

## solution

```javascript
export function makeCounter(start = 0) {
  let count = start
  return {
    next: () => ++count,
    reset: () => {
      count = start
    },
  }
}

export function memoise(fn) {
  const cache = new Map()
  return arg => {
    if (!cache.has(arg)) cache.set(arg, fn(arg))
    return cache.get(arg)
  }
}

export function once(fn) {
  let called = false
  let result
  return (...args) => {
    if (!called) {
      called = true
      result = fn(...args)
    }
    return result
  }
}
```

## explanation

Every piece of state lives in a `let` or `const` inside the outer function, so each call to
`makeCounter`, `memoise` or `once` gets its own. Put `count` at the top of the module instead and
every counter would share it, which is the bug the independence checks look for.

`memoise` uses a `Map` rather than a plain object. Object keys are always strings, so `1` and
`'1'` would collide, and an object argument would become `"[object Object]"`. A `Map` compares
keys with SameValueZero, which also means `NaN` finds itself.

It asks `cache.has(arg)` rather than testing the stored value. `cache.get(arg) ?? fn(arg)` reads
well and calls `fn` again every time the answer was `undefined` or `null`.

`once` keeps a separate `called` flag for the same reason. Testing `result === undefined` would
call a function that returns nothing on every invocation, and a function returning nothing is
exactly what `once` usually wraps: an initialiser, a listener setup, a warning.

## check next counts up from zero

A fresh counter with no start value.

```javascript
const counter = makeCounter()
assert.strictEqual(counter.next(), 1)
assert.strictEqual(counter.next(), 2)
```

## check a counter starts where it is told and resets there

reset returns to start, not to zero.

```javascript
const counter = makeCounter(10)
counter.next()
counter.next()
counter.reset()
assert.strictEqual(counter.next(), 11)
```

## check two counters do not share a count

Each call to makeCounter is a fresh scope.

```javascript
const a = makeCounter()
const b = makeCounter()
a.next()
a.next()
assert.strictEqual(b.next(), 1)
```

## check memoise calls fn once per argument

Three calls, two distinct arguments, two real calls.

```javascript
let calls = 0
const square = memoise(n => {
  calls++
  return n * n
})
assert.strictEqual(square(4), 16)
assert.strictEqual(square(4), 16)
assert.strictEqual(square(5), 25)
assert.strictEqual(calls, 2)
```

## check memoise tells 1 and '1' apart

A plain object would turn both into the key "1".

```javascript
const describe = memoise(value => typeof value)
assert.strictEqual(describe(1), 'number')
assert.strictEqual(describe('1'), 'string')
```

## check memoise caches an undefined result

Nothing found is still an answer.

```javascript
let calls = 0
const lookup = memoise(() => {
  calls++
  return undefined
})
lookup('missing')
lookup('missing')
assert.strictEqual(calls, 1)
```

## check once calls fn a single time and passes its arguments

The second call's arguments are ignored.

```javascript
let calls = 0
const init = once((a, b) => {
  calls++
  return a + b
})
assert.strictEqual(init(2, 3), 5)
assert.strictEqual(init(10, 10), 5)
assert.strictEqual(calls, 1)
```

## check once does not call a function that returned nothing again

The usual thing to wrap in once returns undefined.

```javascript
let calls = 0
const setup = once(() => {
  calls++
})
setup()
setup()
setup()
assert.strictEqual(calls, 1)
```

## hint after 1

```javascript
let count = start
return { next: () => ++count, reset: () => { count = start } }
```

## hint after 2

Store results in a `Map` created inside `memoise`, and ask `cache.has(arg)` before calling `fn`.

## hint after 3

`once` needs two variables in its scope: a `called` flag and the `result`. Do not use the result
to decide whether `fn` has run.
