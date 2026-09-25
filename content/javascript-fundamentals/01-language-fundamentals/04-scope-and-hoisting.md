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

It is *temporal*, not positional. A function may mention a `let` declared below it, as long as
the function is not called until after that line has run:

```javascript
const report = () => `total: ${total}`
const total = 42
report()    // "total: 42"
```

### What to take away

- Names resolve by where the code is written. The call stack is irrelevant.
- Function declarations are callable before their line. Nothing else is.
- `var` before its line reads `undefined`. `let`, `const` and `class` throw.
- A block-scoped name shadows the outer one from the top of the block, so the dead zone can catch
  a reference you thought pointed outwards.

### The exercise

Predict what each snippet below returns, before you run anything. Each one is the body of a
function in a module, so strict mode applies. Write the value it returns, or, if it throws, the
name of the error as a string: `'ReferenceError'` or `'TypeError'`. A snippet that returns
`undefined` is predicted with the value `undefined`, not a string.

Each check runs the snippet for real and compares.

1. Lexical scope

   ```javascript
   const label = 'outer'
   function show() {
     return label
   }
   function run() {
     const label = 'inner'
     return show()
   }
   return run()
   ```

2. A declaration before its line

   ```javascript
   return greet('Ada')
   function greet(name) {
     return `Hello, ${name}`
   }
   ```

3. An expression before its line

   ```javascript
   return greet('Ada')
   var greet = name => `Hello, ${name}`
   ```

4. A var read early

   ```javascript
   const seen = total
   var total = 5
   return seen
   ```

5. A shadowing const

   ```javascript
   const limit = 10
   function check(value) {
     if (value > limit) return 'over'
     const limit = 5
     return 'fine'
   }
   return check(20)
   ```

6. typeof in the dead zone

   ```javascript
   {
     const kind = typeof later
     let later = 1
     return kind
   }
   ```

7. Temporal, not positional

   ```javascript
   const report = () => `total: ${total}`
   const total = 42
   return report()
   ```

## file predictions.js

```javascript
// What each snippet returns, or the name of the error it throws, e.g. 'ReferenceError'.
// Replace every '?'.
export const predictions = [
  '?', // 1. show is called from run
  '?', // 2. greet is called above its declaration
  '?', // 3. greet is a var holding an arrow
  '?', // 4. total is read before its var line
  '?', // 5. check reads limit above its own const
  '?', // 6. typeof of a let above its line
  '?', // 7. report mentions total, declared below it
]
```

## solution

```javascript
export const predictions = [
  'outer', // 1. Scope follows the source text
  'Hello, Ada', // 2. A function declaration is hoisted
  'TypeError', // 3. The var exists but holds undefined
  undefined, // 4. var hoists as undefined
  'ReferenceError', // 5. The inner const shadows from the top of the function
  'ReferenceError', // 6. typeof does not protect a name in its dead zone
  'total: 42', // 7. The arrow is called after total's line has run
]
```

## explanation

Snippet 1 is lexical scope: `show` was written next to the outer `label`, so that is what it
reads, whoever calls it.

Snippets 2 to 4 are the hoisting table. A function declaration is callable before its line. A
`var` exists before its line but holds `undefined`, so reading it gives `undefined` and calling
it is a `TypeError`: the name was found, the value is not a function.

Snippets 5 and 6 are the dead zone. The inner `const limit` owns the name `limit` for the whole
function body, so the comparison above it cannot see the outer `10`, and throws. `typeof` is no
escape: it returns `"undefined"` for a name that was never declared, but a `let` in its dead zone
has been declared, and reading it throws.

Snippet 7 is why the zone is temporal. The arrow mentions `total`, but only reads it when called,
and by then `total` is initialised.

## check there is one prediction per snippet

Seven snippets, seven answers.

```javascript
assert.strictEqual(predictions.length, 7)
```

## check snippet 1: lexical scope

Scope follows the source text, not the caller.

```javascript
const snippet = () => {
  const label = 'outer'
  function show() {
    return label
  }
  function run() {
    const label = 'inner'
    return show()
  }
  return run()
}
let actual
try {
  actual = snippet()
} catch (error) {
  actual = error.name
}
assert.strictEqual(predictions[0], actual, 'snippet 1')
```

## check snippet 2: a declaration before its line

A function declaration is hoisted, body and all.

```javascript
const snippet = () => {
  return greet('Ada')
  function greet(name) {
    return `Hello, ${name}`
  }
}
let actual
try {
  actual = snippet()
} catch (error) {
  actual = error.name
}
assert.strictEqual(predictions[1], actual, 'snippet 2')
```

## check snippet 3: an expression before its line

The var exists but holds undefined, and undefined is not a function.

```javascript
const snippet = () => {
  return greet('Ada')
  var greet = name => `Hello, ${name}`
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

## check snippet 5: a shadowing const

The inner const shadows from the top of the function, so the read is in its dead zone.

```javascript
const snippet = () => {
  const limit = 10
  function check(value) {
    if (value > limit) return 'over'
    const limit = 5
    return 'fine'
  }
  return check(20)
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

## check snippet 7: temporal, not positional

The arrow is called after total's line has run.

```javascript
const snippet = () => {
  const report = () => `total: ${total}`
  const total = 42
  return report()
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

Calling `undefined` is a `TypeError`. Reading a `let` or `const` in its dead zone is a
`ReferenceError`, and `typeof` does not change that.

## hint after 3

An inner declaration shadows the outer name from the top of its scope, not from its own line.
