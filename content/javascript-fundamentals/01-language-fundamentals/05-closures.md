---
type: lesson
title: "Closures"
description: "A function keeping the scope it was created in alive, and what that costs"
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

## A closure holds the variable, not the value

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

## Private state without a class

`balance` above cannot be reached from outside. There is no property to read, no reflection
trick, nothing on the returned object that exposes it. That is genuine privacy, and it predates
`#private` class fields by decades.

The pattern is sometimes called the module pattern: a function runs once, keeps its state in
local variables, and returns only the functions it wants to be public. ES modules made the
standalone version of it redundant, since top-level `let` in a module is already private to that
file, but the per-instance version is still everywhere: React hooks, event emitters, middleware.

## The loop that `let` fixed

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

## What it costs

A closure keeps its whole scope reachable, not just the names it uses. Engines optimise away
variables no inner function mentions, but anything a closure *does* mention stays alive as long
as the closure does.

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

Leaks of this kind share a shape: something long-lived (a listener, a timer, a cache, a global)
holds a closure, and the closure holds something large. Removing the listener or clearing the
timer releases the lot.

## What to take away

- A function remembers the scope it was written in, and keeps it alive.
- It holds variables by reference. Later assignments are visible.
- Each call to the outer function makes a fresh, independent scope.
- Closures give real privacy, and are how most JavaScript state is hidden.
- A long-lived closure keeps whatever it mentions alive with it.
