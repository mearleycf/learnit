---
type: exercise
title: "var, let and const"
description: "Three declarations, two scopes, and why const does not mean immutable"
entry: settings.js
minutes: 25
difficulty: medium
files:
  - name: settings.js
    language: javascript
---

The rule most codebases follow is short: `const` by default, `let` when the binding has to
change, `var` never. This section is why, and what `const` does and does not promise.

| | `var` | `let` | `const` |
| --- | --- | --- | --- |
| Scope | Function | Block | Block |
| Before its line | `undefined` | Throws | Throws |
| Redeclare in the same scope | Allowed | SyntaxError | SyntaxError |
| Reassign | Yes | Yes | TypeError |
| Top-level in a script creates a global property | Yes | No | No |
| New binding per loop iteration | No | Yes | Yes, for `for…of` and `for…in` |

### Function scope leaks out of blocks

`var` ignores every block except a function body.

```javascript
function find(items, id) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].id === id) var match = items[i]
  }
  return { i, match }   // both still in scope
}
```

That compiles and runs. `i` and `match` belong to the whole function, so the loop and the `if`
did not contain them. With `let` (and braces round the `if`, since `let` cannot be a bare `if`
body), the `return` would be a ReferenceError, which is the answer you want: a name declared for a
loop is finished when the loop is.

### Redeclaration hides mistakes

```javascript
var total = 0
// … two hundred lines later …
var total = items.length   // silently the same variable
```

`let` and `const` refuse to declare a name twice in one scope, so the second line is a
SyntaxError that fails the whole file at parse time, before anything runs.

### var at the top of a script touches the global object

In a classic `<script>`, a top-level `var` becomes a property of `window`:

```javascript
var name = 'Ada'
window.name   // "Ada", and you have just overwritten the window's real name property
```

`let` and `const` at the top level create globals that are not properties of anything. ES modules
go further: their top level is module scope, so nothing declared there is global at all. Since
everything in this course is a module, this matters mainly when you read older code.

### const fixes the binding, not the value

`const` means the name cannot be pointed at something else. It says nothing about whether the
thing it points at can change.

```javascript
const user = { name: 'Ada' }
user.name = 'Grace'        // fine, same object, new property value
user = { name: 'Grace' }   // TypeError: Assignment to constant variable.

const ids = [1, 2]
ids.push(3)                // fine
```

For primitives that distinction disappears, since a string or number cannot be modified in place;
a `const` string is as immutable as JavaScript gets.

If you want the object itself to refuse changes, that is `Object.freeze`:

```javascript
const config = Object.freeze({ retries: 3, urls: ['a', 'b'] })
config.retries = 5       // ignored; a TypeError in strict mode, which modules always are
config.urls.push('c')    // works: freeze is shallow
```

Freezing one level is usually enough to catch accidental writes. A deep freeze means walking the
object yourself, and is rarely worth it outside of tests.

### Why const is the default

`const` is not about immutability. It is about reading code: when every binding that changes is
a `let`, the `let`s are the only places you need to look to follow the state. A file of `const`
with two `let`s tells you where the moving parts are.

### What to take away

- `var` is function scoped, hoists as `undefined`, and redeclares silently. Avoid it.
- `let` and `const` are block scoped and throw before their line.
- `const` stops reassignment. It does not stop mutation.
- `Object.freeze` stops mutation, one level deep.
- Default to `const`; a `let` is a signal that the value moves.

### The exercise

`settings.js` was written with `var` throughout and a `const` that was trusted to mean "constant".
Four things are wrong with it. Fix each without changing what the functions are for.

1. `DEFAULTS` must refuse changes, including to its `retryOn` array. Remember that
   `Object.freeze` is shallow.
2. `configure(overrides)` returns the defaults with the overrides applied. It must not change
   `DEFAULTS`, and the object it returns belongs to the caller: pushing onto its `retryOn` must not
   touch the defaults. `configure()` with no argument returns a copy of the defaults.
3. `labelAll(items)` prefixes urgent items' names with `!`. Once one urgent item has been seen,
   every later item gets the prefix too. Find out why.
4. `scheduleAll(names, schedule)` hands one callback per name to `schedule`, which calls them
   later. Each callback should push its own name onto the returned array. They all push
   `undefined`.

## file settings.js

```javascript
// 1. Must refuse changes, retryOn included.
export const DEFAULTS = { retries: 3, timeout: 1000, retryOn: [502, 503] }

// 2. The defaults with overrides applied. DEFAULTS never changes.
export function configure(overrides) {
  var config = DEFAULTS
  for (var key in overrides) config[key] = overrides[key]
  return config
}

// 3. '!' before urgent names only.
export function labelAll(items) {
  var labels = []
  for (var i = 0; i < items.length; i++) {
    if (items[i].urgent) var prefix = '!'
    labels.push(`${prefix ?? ''}${items[i].name}`)
  }
  return labels
}

// 4. Each scheduled callback pushes its own name.
export function scheduleAll(names, schedule) {
  var done = []
  for (var i = 0; i < names.length; i++) {
    schedule(() => done.push(names[i]))
  }
  return done
}
```

## solution

```javascript
export const DEFAULTS = Object.freeze({
  retries: 3,
  timeout: 1000,
  retryOn: Object.freeze([502, 503]),
})

export function configure(overrides = {}) {
  return { ...DEFAULTS, retryOn: [...DEFAULTS.retryOn], ...overrides }
}

export function labelAll(items) {
  const labels = []
  for (const item of items) {
    const prefix = item.urgent ? '!' : ''
    labels.push(`${prefix}${item.name}`)
  }
  return labels
}

export function scheduleAll(names, schedule) {
  const done = []
  for (let i = 0; i < names.length; i++) {
    schedule(() => done.push(names[i]))
  }
  return done
}
```

## explanation

`const DEFAULTS` only fixed the binding. Every caller could still write to the object, and the
starter's `configure` did exactly that, so the first call with an override changed the defaults
for everyone after it. `Object.freeze` makes the object refuse writes, and because modules are
strict, a refused write throws rather than being ignored. Freezing is one level deep, so the
nested array needs its own `Object.freeze`.

Once `DEFAULTS` is frozen, `configure` cannot mutate it and has to build a new object. A spread
copies one level, which would leave the caller's `retryOn` pointing at the frozen array, so it gets
its own copy before the overrides are spread on top.

`labelAll` is the function-scope leak. `var prefix` belongs to the whole function, not to one
iteration, so once it is set to `'!'` nothing sets it back. `let` cannot be the bare body of an
`if`, which is a hint in itself: declare the value per iteration, with a conditional expression,
and it cannot outlive the item it was computed for.

`scheduleAll` is the per-iteration binding. With `var` there is one `i`, and by the time the
callbacks run it equals `names.length`, one past the end, so `names[i]` is `undefined`. A `let` in
the `for` header is a new binding each time round, and each callback keeps its own.

## check DEFAULTS refuses writes

Modules are strict, so a write to a frozen object throws.

```javascript
assert.ok(Object.isFrozen(DEFAULTS), 'DEFAULTS is not frozen')
assert.throws(() => {
  DEFAULTS.retries = 10
})
assert.strictEqual(DEFAULTS.retries, 3)
```

## check DEFAULTS.retryOn is frozen too

Freeze is shallow; the nested array needs its own.

```javascript
assert.ok(Object.isFrozen(DEFAULTS.retryOn), 'retryOn is not frozen')
assert.throws(() => DEFAULTS.retryOn.push(504))
assert.deepStrictEqual([...DEFAULTS.retryOn], [502, 503])
```

## check configure applies overrides without touching DEFAULTS

A new object, with the defaults underneath.

```javascript
const config = configure({ retries: 5 })
assert.strictEqual(config.retries, 5)
assert.strictEqual(config.timeout, 1000)
assert.notStrictEqual(config, DEFAULTS)
assert.strictEqual(DEFAULTS.retries, 3)
assert.strictEqual(configure({ timeout: 50 }).retries, 3)
```

## check configure hands the caller an array it can change

Pushing onto the returned retryOn leaves the defaults alone.

```javascript
const config = configure()
assert.deepStrictEqual([...config.retryOn], [502, 503])
config.retryOn.push(504)
assert.deepStrictEqual([...configure().retryOn], [502, 503])
assert.deepStrictEqual([...DEFAULTS.retryOn], [502, 503])
```

## check labelAll prefixes only the urgent items

A var would carry the prefix on to every later item.

```javascript
assert.deepStrictEqual(
  labelAll([{ name: 'deploy', urgent: true }, { name: 'lunch' }, { name: 'fire', urgent: true }, { name: 'docs' }]),
  ['!deploy', 'lunch', '!fire', 'docs'],
)
```

## check each scheduled callback pushes its own name

The callbacks run after the loop has finished.

```javascript
const queue = []
const done = scheduleAll(['a', 'b', 'c'], callback => queue.push(callback))
assert.deepStrictEqual(done, [])
for (const callback of queue) callback()
assert.deepStrictEqual(done, ['a', 'b', 'c'])
```

## hint after 1

`Object.freeze` returns the object it froze, so it can wrap the literal, and a second
`Object.freeze` can wrap the array inside it.

## hint after 2

`configure` has to return a new object: `{ ...DEFAULTS, retryOn: [...DEFAULTS.retryOn], ...overrides }`.

## hint after 3

A `var` is shared by every iteration of a loop. Declare `prefix` with `const` inside the loop body,
from a conditional expression, and change the `for` header in `scheduleAll` to `let`.
