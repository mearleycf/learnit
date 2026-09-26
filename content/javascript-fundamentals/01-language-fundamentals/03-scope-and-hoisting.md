---
type: exercise
title: "Scope and Hoisting"
description: "What a name resolves to before the line declaring it runs, and why let has a dead zone"
entry: predictions.js
minutes: 20
difficulty: medium
files:
  - name: predictions.js
    language: javascript
---

A JavaScript engine reads a scope twice. The first pass finds every declaration and creates the
bindings. The second pass runs the code. Hoisting is the name for what the first pass leaves
behind, and it is not the same for every kind of declaration.

### Scope is decided by where code is written

JavaScript is lexically scoped. A name resolves by looking outwards through the blocks and
functions that *contain the source text*, not through the functions that happen to be on the
call stack.

```javascript
const label = 'outer'

function show() {
  return label
}

function run() {
  const label = 'inner'
  return show()
}

run()   // "outer"
```

`show` was written next to the outer `label`, so that is the one it sees, whoever calls it. This
chain of enclosing scopes is fixed when the function is created, which is what makes closures
possible in the next section.

Each of these creates a scope:

- A module, or the global script.
- A function body, including its parameter list.
- A block, `{ … }`, for `let`, `const` and `class`. Not for `var`.

An inner declaration **shadows** an outer one of the same name for the whole of the inner scope.

### What each declaration hoists

The first pass creates every binding at the top of its scope. What differs is whether the
binding is usable before its line runs.

| Declaration | Scope | Before its line |
| --- | --- | --- |
| `function f() {}` | Function; the block, if declared inside one in strict code or a module | Fully usable, body and all |
| `var x` | Function | Exists, holds `undefined` |
| `let x`, `const x` | Block | Exists, but reading it throws |
| `class C {}` | Block | Exists, but reading it throws |
| `import` | Module | Fully usable, resolved before any code runs |

A function declaration is the one case where "hoisting" means what it sounds like:

```javascript
greet('Ada')          // works

function greet(name) {
  return `Hello, ${name}`
}
```

That is why a module can put its exported functions first and its helpers at the bottom.

A function *expression* is only as hoisted as the variable holding it:

```javascript
greet('Ada')          // TypeError: greet is not a function (var: it is undefined)
var greet = name => `Hello, ${name}`
```

### The temporal dead zone

A `let` or `const` binding exists from the start of its block, but is uninitialised until its
declaration line runs. That window is the temporal dead zone, and touching the name inside it
throws.

```javascript
{
  console.log(count)    // ReferenceError: Cannot access 'count' before initialization
  let count = 1
}
```

The binding existing early is what makes this matter. It shadows any outer name from the very
top of the block, not from the declaration down:

```javascript
const limit = 10

function check(value) {
  if (value > limit) return 'over'   // ReferenceError, not 10
  const limit = 5
  return 'fine'
}
```

With `var` the same code would silently compare against `undefined` and return `'fine'` for
every input. The dead zone turns a wrong answer into a crash, which is the better failure.

It is *temporal*, not positional. A function may mention a `let` or `const` declared below it, as
long as the function is not called until after that line has run:

```javascript
const report = () => `total: ${total}`
const total = 42
report()    // "total: 42"
```

### What to take away

- Names resolve by where the code is written. The call stack is irrelevant.
- Function declarations and imports are usable before their line; nothing else is.
- `var` before its line reads `undefined`. `let`, `const` and `class` throw.
- A block-scoped name shadows the outer one from the top of the block, so the dead zone can catch
  a reference you thought pointed outwards.

### The exercise

Predict what each snippet below returns, before you run anything. None of them is an example from
above; each applies one of the rules to a case the prose does not show. Each one is the body of a
function in a module, so strict mode applies. Write the value it returns, or, if it throws, the
name of the error as a string, such as `'ReferenceError'`. A snippet that returns `undefined` is
predicted with the value `undefined`, not a string.

Each check runs the snippet for real and compares.

1. A shadowing parameter

   ```javascript
   const unit = 'kg'
   const format = n => `${n}${unit}`
   function report(unit) {
     return format(3)
   }
   return report('lb')
   ```

2. A class before its line

   ```javascript
   const origin = new Point(0, 0)
   class Point {
     constructor(x, y) {
       this.x = x
       this.y = y
     }
   }
   return origin.x
   ```

3. A var inside an if

   ```javascript
   function pick(flag) {
     if (flag) {
       var choice = 'yes'
     }
     return choice
   }
   return `${pick(true)} ${pick(false)}`
   ```

4. A var read early

   ```javascript
   const seen = total
   var total = 5
   return seen
   ```

5. A let in a for header

   ```javascript
   const readers = []
   for (let i = 0; i < 3; i++) {
     readers.push(() => i)
   }
   return readers[0]() + readers[2]()
   ```

6. typeof in the dead zone

   ```javascript
   {
     const kind = typeof later
     let later = 1
     return kind
   }
   ```

7. A hoisted function called too early

   ```javascript
   function label(name) {
     return `${prefix}${name}`
   }
   const first = label('item')
   const prefix = '#'
   return first
   ```

## file predictions.js

```javascript
// What each snippet returns, or the name of the error it throws, e.g. 'ReferenceError'.
// Replace every '?'.
export const predictions = [
  '?', // 1. format is called from inside report
  '?', // 2. Point is constructed above its class
  '?', // 3. choice is declared inside the if
  '?', // 4. total is read before its var line
  '?', // 5. readers close over the loop's i
  '?', // 6. typeof of a let above its line
  '?', // 7. label is called before prefix's line
]
```

## solution

```javascript
export const predictions = [
  '3kg', // 1. format was written next to the outer unit
  'ReferenceError', // 2. A class hoists like let
  'yes undefined', // 3. The var belongs to the whole function
  undefined, // 4. var hoists as undefined
  2, // 5. A let in the header is a fresh binding per iteration
  'ReferenceError', // 6. typeof does not protect a name in its dead zone
  'ReferenceError', // 7. label is hoisted and callable
]
```

## explanation

Snippet 1 is lexical scope. `report` has a parameter called `unit`, but `format` was written at
the top level, next to the outer `unit`, so that is the one it reads, whoever calls it.

Snippets 2 to 4 are the hoisting table. A `class` is hoisted like `let`: the name exists from the
top of the scope but is in its dead zone until the declaration runs, so constructing it early
throws, unlike a function declaration. A `var` ignores the `if` block and belongs to the whole
function, so `pick(false)` still finds `choice`, holding `undefined`. Reading a `var` before its
line gives `undefined` for the same reason.

Snippet 5 is the per-iteration binding. Each pass through a `for (let …)` loop gets a new `i`, so
the first reader keeps `0` and the third keeps `2`. With `var` there would be one `i`, left at `3`,
and the sum would be `6`.

Snippets 6 and 7 are the dead zone. `typeof` returns `"undefined"` for a name that was never
declared, but a `let` in its dead zone has been declared, and reading it throws. In snippet 7,
`label` is a function declaration, so calling it early is allowed; but it reads `prefix` when it
runs, and it runs before `prefix`'s line. Hoisting makes the function available, not the names it
uses.

## check there is one prediction per snippet

Seven snippets, seven answers.

```javascript
assert.strictEqual(predictions.length, 7)
```

## check snippet 1: a shadowing parameter

format was written next to the outer unit, so report's parameter never reaches it.

```javascript
const snippet = () => {
  const unit = 'kg'
  const format = n => `${n}${unit}`
  function report(unit) {
    return format(3)
  }
  return report('lb')
}
let actual
try {
  actual = snippet()
} catch (error) {
  actual = error.name
}
assert.strictEqual(predictions[0], actual, 'snippet 1')
```

## check snippet 2: a class before its line

A class hoists like let, into the dead zone, not like a function declaration.

```javascript
const snippet = () => {
  const origin = new Point(0, 0)
  class Point {
    constructor(x, y) {
      this.x = x
      this.y = y
    }
  }
  return origin.x
}
let actual
try {
  actual = snippet()
} catch (error) {
  actual = error.name
}
assert.strictEqual(predictions[1], actual, 'snippet 2')
```

## check snippet 3: a var inside an if

The var belongs to the whole function, so it exists even when the if does not run.

```javascript
const snippet = () => {
  function pick(flag) {
    if (flag) {
      var choice = 'yes'
    }
    return choice
  }
  return `${pick(true)} ${pick(false)}`
}
let actual
try {
  actual = snippet()
} catch (error) {
  actual = error.name
}
assert.strictEqual(predictions[2], actual, 'snippet 3')
```

## check snippet 4: a var read early

var hoists as undefined.

```javascript
const snippet = () => {
  const seen = total
  var total = 5
  return seen
}
let actual
try {
  actual = snippet()
} catch (error) {
  actual = error.name
}
assert.strictEqual(predictions[3], actual, 'snippet 4')
```

## check snippet 5: a let in a for header

A let in the header is a fresh binding per iteration, so the readers see 0 and 2.

```javascript
const snippet = () => {
  const readers = []
  for (let i = 0; i < 3; i++) {
    readers.push(() => i)
  }
  return readers[0]() + readers[2]()
}
let actual
try {
  actual = snippet()
} catch (error) {
  actual = error.name
}
assert.strictEqual(predictions[4], actual, 'snippet 5')
```

## check snippet 6: typeof in the dead zone

typeof does not protect a name in its dead zone; it only protects an undeclared one.

```javascript
const snippet = () => {
  {
    const kind = typeof later
    let later = 1
    return kind
  }
}
let actual
try {
  actual = snippet()
} catch (error) {
  actual = error.name
}
assert.strictEqual(predictions[5], actual, 'snippet 6')
```

## check snippet 7: a hoisted function called too early

label is hoisted and callable, but it reads prefix when it runs, and it runs inside the dead zone.

```javascript
const snippet = () => {
  function label(name) {
    return `${prefix}${name}`
  }
  const first = label('item')
  const prefix = '#'
  return first
}
let actual
try {
  actual = snippet()
} catch (error) {
  actual = error.name
}
assert.strictEqual(predictions[6], actual, 'snippet 7')
```

## hint after 1

Only a function declaration is usable before its line. `var` gives `undefined`; `let`, `const` and
`class` throw a `ReferenceError`.

## hint after 2

`var` is scoped to the function, not the block, and a `let` in a `for` header is new on every
iteration.

## hint after 3

A function reads a name when it is called, not when it is written. Called inside the dead zone,
it throws.
