---
type: lesson
title: "Scope and Hoisting"
description: "What a name resolves to before the line declaring it runs, and why let has a dead zone"
---

A JavaScript engine reads a scope twice. The first pass finds every declaration and creates the
bindings. The second pass runs the code. Hoisting is the name for what the first pass leaves
behind, and it is not the same for every kind of declaration.

## Scope is decided by where code is written

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

## What each declaration hoists

The first pass creates every binding at the top of its scope. What differs is whether the
binding is usable before its line runs.

| Declaration | Scope | Before its line |
| --- | --- | --- |
| `function f() {}` | Function | Fully usable, body and all |
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

## The temporal dead zone

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

## What to take away

- Names resolve by where the code is written. The call stack is irrelevant.
- Function declarations are callable before their line. Nothing else is.
- `var` before its line reads `undefined`. `let`, `const` and `class` throw.
- A block-scoped name shadows the outer one from the top of the block, so the dead zone can catch
  a reference you thought pointed outwards.
