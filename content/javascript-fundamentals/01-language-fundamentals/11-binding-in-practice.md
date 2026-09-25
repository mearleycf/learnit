---
type: exercise
title: "Binding in Practice"
description: "Fix three broken callbacks with bind, an arrow and a captured reference"
entry: clicker.js
minutes: 20
difficulty: medium
files:
  - name: clicker.js
    language: javascript
---

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

## hint after 1

```javascript
return this.increment.bind(this)
```

## hint after 2

Swap `function () { … }` in `clickAll` for `() => { … }`. The body does not change.

## hint after 3

In `listener`, put `this` in a variable before the `return`, then use that variable for the
clicker and `this` for the element.
