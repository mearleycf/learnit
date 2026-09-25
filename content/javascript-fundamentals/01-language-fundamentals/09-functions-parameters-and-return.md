---
type: lesson
title: "Functions, Parameters and Return"
description: "Declarations against expressions, default and rest parameters, and what arity actually reports"
---

Functions are objects you can call. They have properties, they can be passed and stored, and the
way one is written decides how it hoists, what `this` it gets and whether it can be used with
`new`.

## Four ways to write one

```javascript
function area(w, h) { return w * h }          // declaration
const area = function (w, h) { return w * h }  // expression
const area = (w, h) => w * h                   // arrow
const shape = { area(w, h) { return w * h } }  // method shorthand
```

| Form | Hoisted | Own `this` | `new` works | `arguments` |
| --- | --- | --- | --- | --- |
| Declaration | Yes, fully | Yes | Yes | Yes |
| Expression | As its variable | Yes | Yes | Yes |
| Arrow | As its variable | No, inherits | No | No |
| Method shorthand | With its object | Yes | No | Yes |

The `this` column is the next section. For now: arrows have no `this` of their own, which is why
they suit callbacks and do not suit object methods.

An expression can carry a name, `const f = function retry() {}`, and that name is visible inside
the function only. It is useful for recursion and it shows in stack traces.

## Parameters are optional by default

JavaScript never checks how many arguments you passed. Missing ones are `undefined`; extra ones
are dropped.

```javascript
const greet = (name, greeting) => `${greeting}, ${name}`
greet('Ada')               // "undefined, Ada"
greet('Ada', 'Hi', 'x')    // "Hi, Ada"
```

### Defaults

A default applies when the argument is `undefined`, whether missing or passed explicitly. It does
**not** apply for `null`.

```javascript
const greet = (name, greeting = 'Hello') => `${greeting}, ${name}`
greet('Ada')              // "Hello, Ada"
greet('Ada', undefined)   // "Hello, Ada"
greet('Ada', null)        // "null, Ada"
```

Defaults are expressions evaluated on each call, left to right, so a later one can use an earlier
one, and `= []` gives a fresh array every time rather than a shared one:

```javascript
function page(items, size = 10, pages = Math.ceil(items.length / size)) { … }
function push(item, into = []) { into.push(item); return into }
push(1)   // [1]
push(2)   // [2], not [1, 2]
```

That second point is worth knowing if you have written Python, where a mutable default is shared
across calls.

### Rest and destructuring

A rest parameter gathers what is left into a real array. It replaces `arguments`, which is
array-like but not an array, and which arrows do not have.

```javascript
const sum = (...numbers) => numbers.reduce((a, b) => a + b, 0)
sum(1, 2, 3)   // 6
```

Destructuring a parameter gives you named arguments. Default the whole object as well, or calling
with nothing throws:

```javascript
function connect({ host = 'localhost', port = 5432 } = {}) {
  return `${host}:${port}`
}
connect()                 // "localhost:5432"
connect({ port: 6543 })   // "localhost:6543"
```

Past two or three positional parameters, an options object is kinder to the caller: no one has to
remember that the fourth argument is the timeout.

## What length reports

`fn.length` is the number of parameters **before the first default or rest**. It is what a
function says it expects, not what it can accept.

```javascript
((a, b) => {}).length          // 2
((a, b = 1) => {}).length      // 1
((a, b = 1, c) => {}).length   // 1, stops at the first default
((...args) => {}).length       // 0
(({ a, b }) => {}).length      // 1, one destructured parameter
```

Libraries use it: Express decides a middleware function is an error handler when its `length` is
4, and a currying helper reads it to know when enough arguments have arrived. Add a default to one
of those parameters and the library stops recognising your function.

## Return

A function without a `return`, or with a bare `return;`, gives back `undefined`. A constructor
called with `new` is the one exception: it returns the new object unless it explicitly returns a
different object.

Two traps with the syntax:

```javascript
const make = () => { id: 1 }       // undefined: the braces are a block, `id:` a label
const make = () => ({ id: 1 })     // { id: 1 }

function total() {
  return          // automatic semicolon insertion ends the statement here
    1 + 2         // never reached; total() is undefined
}
```

Put the returned expression on the same line as `return`, or open a parenthesis there.

## What to take away

- Declarations hoist; expressions and arrows are only as available as their variable.
- Missing arguments are `undefined`, and a default replaces `undefined` but not `null`.
- Defaults are evaluated per call, so `= []` is safe.
- Use rest parameters, not `arguments`.
- `length` counts parameters up to the first default or rest.
