---
type: lesson
title: "this and Binding"
description: "Four rules for what this is, and the one arrow functions opt out of"
---

Most names in JavaScript resolve by where the code is written. `this` is the exception: for an
ordinary function it is decided by **how the function is called**, fresh on every call. The same
function can see a different `this` each time.

Four rules cover it, checked in this order.

## 1. new

Called with `new`, a function gets a brand-new object as `this`, linked to the function's
`prototype`, and returns it.

```javascript
function Point(x, y) {
  this.x = x
  this.y = y
}
const p = new Point(1, 2)   // this was the new object
```

Class constructors work the same way, and refuse to be called without `new`.

## 2. call, apply and bind

You can pass `this` explicitly.

```javascript
function describe(unit) {
  return `${this.value}${unit}`
}

describe.call({ value: 5 }, 'px')      // "5px", arguments listed
describe.apply({ value: 5 }, ['px'])   // "5px", arguments as an array
const five = describe.bind({ value: 5 })
five('em')                              // "5em"
```

`bind` returns a new function with `this` fixed permanently. Calling it with `call`, or as a
method of another object, does not change it. Only `new` can override a bound `this`.

## 3. Called as a method

When the call expression has a dot or bracket before the parentheses, `this` is the object to the
left of it.

```javascript
const counter = {
  count: 0,
  increment() {
    this.count++
  },
}
counter.increment()   // this is counter
```

The rule is about **the call site, not where the function lives**. Take the function off the
object and call it bare, and the link is gone:

```javascript
const increment = counter.increment
increment()   // this is undefined: TypeError reading count
```

That line is what happens, invisibly, every time a method is passed as a callback:

```javascript
setTimeout(counter.increment, 100)                    // loses this
items.forEach(counter.increment)                      // loses this
button.addEventListener('click', counter.increment)   // this is the button
```

The function is handed over as a value, and whatever calls it later calls it bare, or with a
`this` of its own choosing. Event listeners set `this` to the element, which is rarely the object
you meant.

## 4. Called bare

A plain call, `fn()`, gets `this` as `undefined` in strict mode. Modules and classes are always
strict, so in this course that is the answer. In old sloppy-mode scripts it falls back to the
global object instead, which is how a lost method used to write properties onto `window` rather
than failing.

## Arrows opt out

Arrow functions do not have a `this` binding at all. `this` inside an arrow is looked up
lexically, like any other variable, from the scope the arrow was written in. None of the four
rules apply to them: `call`, `apply` and `bind` cannot change it, and `new` throws.

That makes arrows right for callbacks inside a method, where you want the method's `this`:

```javascript
const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++   // start's this, which is timer
    }, 1000)
  },
}
```

And wrong for methods themselves, where there is no enclosing `this` worth having:

```javascript
const account = {
  balance: 10,
  read: () => this.balance,   // module scope this: undefined
}
```

## Fixing a lost this

Three ways, each suited to a different situation. The exercise after this puts each into practice.

| Fix | Looks like | Use when |
| --- | --- | --- |
| `bind` | `setTimeout(counter.increment.bind(counter))` | Passing an existing method along |
| Arrow wrapper | `setTimeout(() => counter.increment())` | Inline at the call site; you can add arguments too |
| Captured reference | `const self = this` in the outer function | Older code, or when you also need the callee's `this` |

Class fields give a fourth pattern that is common in React class components and event-heavy code:
`handle = () => { … }` defines an arrow per instance, so it is always bound to that instance.

## What to take away

- `this` is chosen by the call, not the definition, for every function except an arrow.
- Order of rules: `new`, then explicit binding, then method call, then bare call.
- Passing `obj.method` as a value drops the object. The call site decides.
- Bare calls in strict code get `undefined`.
- Arrows take `this` from where they are written, and nothing can change it.
