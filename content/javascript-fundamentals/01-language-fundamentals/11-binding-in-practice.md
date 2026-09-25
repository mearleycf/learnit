---
type: exercise
title: "Binding in Practice"
description: "Four rules for what this is, and three broken callbacks fixed with bind, an arrow and a captured reference"
entry: clicker.js
minutes: 30
difficulty: medium
files:
  - name: clicker.js
    language: javascript
---

Most names in JavaScript resolve by where the code is written. `this` is the exception: for an
ordinary function it is decided by **how the function is called**, fresh on every call. The same
function can see a different `this` each time.

Four rules cover it, checked in this order.

### 1. new

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

### 2. call, apply and bind

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

### 3. Called as a method

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

### 4. Called bare

A plain call, `fn()`, gets `this` as `undefined` in strict mode. Modules and classes are always
strict, so in this course that is the answer. In old sloppy-mode scripts it falls back to the
global object instead, which is how a lost method used to write properties onto `window` rather
than failing.

### Arrows opt out

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
  read: () => this.balance,   // this is undefined at module scope: account.read() throws
}
```

### Fixing a lost this

Three ways, each suited to a different situation. The exercise below puts each into practice.

| Fix | Looks like | Use when |
| --- | --- | --- |
| `bind` | `setTimeout(counter.increment.bind(counter))` | Passing an existing method along |
| Arrow wrapper | `setTimeout(() => counter.increment())` | Inline at the call site; you can add arguments too |
| Captured reference | `const self = this` in the outer function | Older code, or when you also need the callee's `this` |

Class fields give a fourth pattern that is common in React class components and event-heavy code:
`handle = () => { … }` defines an arrow per instance, so it is always bound to that instance.

### What to take away

- `this` is chosen by the call, not the definition, for every function except an arrow.
- Order of rules: `new`, then explicit binding, then method call, then bare call.
- Passing `obj.method` as a value drops the object. The call site decides.
- Bare calls in strict code get `undefined`.
- Arrows take `this` from where they are written, and nothing can change it.

### The exercise

`Clicker` counts clicks. Each of its three methods hands a function to someone else to call later,
and each one loses `this` on the way. Fix them, using a different technique for each, because each
suits a different situation.

1. `handler()` returns a function the caller will invoke bare, as `setTimeout` would. Calling it
   must increment this clicker. Use `bind`.
2. `clickAll(items)` increments once per item with `forEach`, then returns the count. Use an arrow.
3. `listener()` returns a function to be called the way an event listener is: with `this` set to
   the element that was clicked. It must push that element onto the clicker's `clickedOn` array
   *and* increment the clicker. It needs both `this` values at once, so an arrow will not do. Use
   a captured reference.
4. Outside the class, `Tally` and `add` were written as arrows, so neither has a `this` of its own
   and `new Tally(3)` throws. Rewrite them so each of the four rules works: `new Tally(start)`
   makes an object whose `total` is `start`; `add(amount)` adds to `this.total` and returns it,
   whether it is called as a method, through `call`, or bound with `bind`. Called bare, it should
   throw a `TypeError`, as strict code does.

A class body is strict mode, so a lost `this` is `undefined` and the starter throws rather than
quietly writing to the global object.

## file clicker.js

```javascript
export class Clicker {
  constructor() {
    this.count = 0
    this.clickedOn = []
  }

  increment() {
    this.count++
    return this.count
  }

  // 1. A function that still increments this clicker when called bare. Use bind.
  handler() {
    return this.increment
  }

  // 2. Increment once per item, then return the count. Use an arrow.
  clickAll(items) {
    items.forEach(function () {
      this.increment()
    })
    return this.count
  }

  // 3. Called with this set to an element. Record the element and increment. Capture a reference.
  listener() {
    return function () {
      this.clickedOn.push(this)
      this.increment()
    }
  }
}

// 4. Make each of the four rules work: new, call and bind, method, bare.
export const Tally = start => {
  this.total = start
}

export const add = amount => {
  this.total += amount
  return this.total
}
```

## solution

```javascript
export class Clicker {
  constructor() {
    this.count = 0
    this.clickedOn = []
  }

  increment() {
    this.count++
    return this.count
  }

  handler() {
    return this.increment.bind(this)
  }

  clickAll(items) {
    items.forEach(() => {
      this.increment()
    })
    return this.count
  }

  listener() {
    const clicker = this
    return function () {
      clicker.clickedOn.push(this)
      clicker.increment()
    }
  }
}

export function Tally(start) {
  this.total = start
}

export function add(amount) {
  this.total += amount
  return this.total
}
```

## explanation

`handler` returns `this.increment`, which is just the function: the object it was read from is
not part of the value. `bind(this)` makes a new function with `this` fixed to the clicker, and
nothing the caller does, not even calling it as a method of another object, can change it.

`clickAll` passes a `function` expression to `forEach`, and `forEach` calls its callback bare, so
inside it `this` is `undefined`. An arrow has no `this` of its own and reads `clickAll`'s, which is
the clicker. This is the most common fix you will write, because the callback is right there at
the call site.

`listener` needs two different objects: the element, which arrives as the callback's own `this`,
and the clicker. An arrow would give you the clicker and throw the element away. So the function
stays a `function`, keeps its call-time `this`, and reaches the clicker through a variable the
closure captured. `const self = this` is the traditional spelling of the same idea; a descriptive
name reads better.

`Tally` and `add` only need to become `function`s. An arrow takes `this` from where it was
written, which at the top of a module is `undefined`, and no rule can change that: `new` refuses
an arrow outright, and `call` and `bind` pass a `this` the arrow ignores. A `function` gets its
`this` from each call instead, so the same `add` reads whichever object the call site supplies,
and a bare call in strict code gets `undefined`, which is why it throws.

## check handler increments when called bare

The way setTimeout would call it.

```javascript
const clicker = new Clicker()
const onTick = clicker.handler()
onTick()
onTick()
assert.strictEqual(clicker.count, 2)
```

## check handler stays bound when borrowed by another object

bind fixes this for good.

```javascript
const clicker = new Clicker()
const other = { count: 100, run: clicker.handler() }
other.run()
assert.strictEqual(clicker.count, 1)
assert.strictEqual(other.count, 100)
```

## check two clickers keep separate counts

Each handler is bound to its own instance.

```javascript
const a = new Clicker()
const b = new Clicker()
a.handler()()
assert.strictEqual(a.count, 1)
assert.strictEqual(b.count, 0)
```

## check clickAll counts every item

Three items, three increments.

```javascript
const clicker = new Clicker()
assert.strictEqual(clicker.clickAll(['a', 'b', 'c']), 3)
```

## check listener records the element it was called on

this inside the listener is the element, as addEventListener arranges.

```javascript
const clicker = new Clicker()
const button = { id: 'save' }
clicker.listener().call(button)
assert.strictEqual(clicker.clickedOn[0], button)
```

## check listener increments the clicker, not the element

The element's this and the clicker are both needed.

```javascript
const clicker = new Clicker()
const button = { id: 'save' }
const onClick = clicker.listener()
onClick.call(button)
onClick.call(button)
assert.strictEqual(clicker.count, 2)
assert.strictEqual(button.count, undefined)
```

## check new makes Tally a fresh object

Rule 1: new creates this and returns it.

```javascript
const tally = new Tally(3)
assert.strictEqual(tally.total, 3)
assert.ok(tally instanceof Tally, 'new Tally() is not a Tally')
assert.strictEqual(new Tally(7).total, 7)
```

## check call and bind choose this for add

Rule 2: an explicit this. A bound function keeps it even when called another way.

```javascript
const box = { total: 10 }
assert.strictEqual(add.call(box, 5), 15)
assert.strictEqual(box.total, 15)
assert.strictEqual(add.apply(box, [1]), 16)
const bound = add.bind({ total: 0 })
assert.strictEqual(bound.call({ total: 100 }, 1), 1)
```

## check add called as a method uses its object

Rule 3: the object to the left of the dot.

```javascript
const first = { total: 1, add }
const second = { total: 50, add }
assert.strictEqual(first.add(4), 5)
assert.strictEqual(second.add(4), 54)
assert.strictEqual(first.total, 5)
```

## check add called bare throws a TypeError

Rule 4: a bare call in strict code gets undefined.

```javascript
let error
try {
  add(1)
} catch (caught) {
  error = caught
}
assert.ok(error instanceof TypeError, 'a bare add() did not throw a TypeError')
```

## hint after 1

```javascript
return this.increment.bind(this)
```

## hint after 2

Swap `function () { … }` in `clickAll` for `() => { … }`. The body does not change.

## hint after 3

In `listener`, put `this` in a variable before the `return`, then use that variable for the
clicker and `this` for the element.

## hint after 4

`Tally` and `add` only need to be written as `function` declarations. Arrows cannot have a `this`
of their own, and `new` rejects them.
