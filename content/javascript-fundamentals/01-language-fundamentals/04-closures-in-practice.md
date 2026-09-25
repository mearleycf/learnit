---
type: exercise
title: "Closures in Practice"
description: "A function keeping the scope it was created in alive, and a counter, memoiser and once built from it"
entry: closures.js
minutes: 30
difficulty: medium
files:
  - name: closures.js
    language: javascript
---

A closure is a function together with the scope it was created in. Every function in JavaScript
is one; the term only earns its keep when the function outlives that scope.

```javascript
function makeCounter() {
  let count = 0
  return () => ++count
}

const next = makeCounter()
next()   // 1
next()   // 2
```

`makeCounter` has returned, so by stack logic `count` should be gone. It is not, because the
returned arrow still refers to it. The engine keeps the scope alive for as long as something can
reach it.

### A closure holds the variable, not the value

This is the part that trips people up. A closure does not take a snapshot. It holds a live
reference to the binding, so it sees every later assignment.

```javascript
let greeting = 'Hello'
const greet = name => `${greeting}, ${name}`

greeting = 'Goodbye'
greet('Ada')   // "Goodbye, Ada"
```

Two closures created in the same call share the same scope, so each sees the other's writes:

```javascript
function makeAccount() {
  let balance = 0
  return {
    deposit: amount => { balance += amount },
    read: () => balance,
  }
}

const account = makeAccount()
account.deposit(50)
account.read()   // 50
```

A second call to `makeAccount` creates a second, independent `balance`. Each call is a fresh scope.

### Private state without a class

`balance` above cannot be reached from outside. There is no property to read, no reflection
trick, nothing on the returned object that exposes it. That is genuine privacy, and it predates
`#private` class fields by decades.

The pattern is sometimes called the module pattern: a function runs once, keeps its state in
local variables, and returns only the functions it wants to be public. ES modules made the
standalone version of it redundant, since top-level `let` in a module is already private to that
file, but the per-instance version is still everywhere: React hooks, event emitters, middleware.

### The loop that `let` fixed

Before `let`, this was the canonical closure bug:

```javascript
var handlers = []
for (var i = 0; i < 3; i++) {
  handlers.push(() => i)
}
handlers.map(h => h())   // [3, 3, 3]
```

One `var i` for the whole function, three closures over it, and by the time any of them run the
loop has left it at `3`. Swap `var` for `let` and each iteration gets its own binding, so the
result is `[0, 1, 2]`. The closures behave identically in both versions; only the number of
variables changed.

### What it costs

Engines do not keep a whole scope alive for a closure. Variables that no inner function mentions
are optimised away; anything a closure *does* mention stays alive as long as the closure does.

```javascript
function attach(element) {
  const rows = loadTenThousandRows()
  element.addEventListener('click', () => {
    console.log(`clicked, ${rows.length} rows`)
  })
}
```

That listener pins `rows` in memory until the listener is removed or the element is collected.
The fix is to capture only what you need, here `const count = rows.length`, so the large array
can go.

There is a catch. Closures created in the same scope share one set of captured variables, so a
value captured by *any* of them is retained by every sibling that outlives the scope:

```javascript
function attach(element) {
  const rows = loadTenThousandRows()
  const count = rows.length
  const ids = () => rows.map(row => row.id)   // mentions rows, never escapes
  element.addEventListener('click', () => {
    console.log(`clicked, ${count} rows`)       // mentions only count
  })
}
```

The listener never touches `rows`, but `ids` does, and the two share their captured scope. As long
as the listener lives, `rows` does too. When a closure outlives its scope, check what its siblings
mention, not just what it mentions itself.

Leaks of this kind share a shape: something long-lived (a listener, a timer, a cache, a global)
holds a closure, and the closure holds something large. Removing the listener or clearing the
timer releases the lot.

### What to take away

- A function remembers the scope it was written in, and keeps alive what it mentions.
- It holds variables by reference. Later assignments are visible.
- Each call to the outer function makes a fresh, independent scope.
- Closures give real privacy, and are how most JavaScript state is hidden.
- A long-lived closure keeps alive whatever it, or any sibling from the same scope, mentions.

### The exercise

Four functions that each return functions, and keep their state in the scope they close over.
No classes, no module-level variables: every call to the outer function must produce independent
state.

1. `makeCounter(start)` returns an object with `next()`, which adds one and returns the new
   value, and `reset()`, which puts the count back to `start`. `start` defaults to `0`.
2. `memoise(fn)` returns a function taking one argument. The first call with a given argument
   calls `fn`; later calls with the same argument return the stored result without calling it.
   A result of `undefined` is still a result, and must be cached too.
3. `once(fn)` returns a function that calls `fn` the first time, passing its arguments through,
   and on every later call returns that first result without calling `fn` again.
4. `makeHandlers(count)` returns an array of `count` functions, where the function at index `i`
   returns `i`. The starter is the loop from above that returns the same number from every
   handler. Fix it so each handler keeps its own index.

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

// 4. handlers[i]() should return i. Right now every handler returns count.
export function makeHandlers(count) {
  var handlers = []
  for (var i = 0; i < count; i++) {
    handlers.push(() => i)
  }
  return handlers
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

export function makeHandlers(count) {
  const handlers = []
  for (let i = 0; i < count; i++) {
    handlers.push(() => i)
  }
  return handlers
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

`makeHandlers` changes one keyword. With `var` there is one `i` for the whole function, every
arrow closes over it, and by the time any runs the loop has left it at `count`. A `let` in a `for`
header gets a fresh binding per iteration, so each arrow closes over its own `i`.

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

## check each handler returns its own index

The loop-of-closures bug returns the final value from every handler.

```javascript
const handlers = makeHandlers(3)
assert.strictEqual(handlers.length, 3)
assert.deepStrictEqual(
  handlers.map(handler => handler()),
  [0, 1, 2],
)
```

## check handlers keep their index after the loop is long finished

Calling one twice, out of order, still gives its own index.

```javascript
const handlers = makeHandlers(5)
assert.strictEqual(handlers[4](), 4)
assert.strictEqual(handlers[1](), 1)
assert.strictEqual(handlers[1](), 1)
assert.deepStrictEqual(makeHandlers(0), [])
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

## hint after 4

In `makeHandlers`, change the `var` in the `for` header to `let`. Each iteration then gets its own
`i`.
