---
type: exercise
title: "Functions, Parameters and Return"
description: "Declarations against expressions, default and rest parameters, and what arity actually reports"
entry: functions.js
minutes: 25
difficulty: medium
files:
  - name: functions.js
    language: javascript
---

Functions are objects you can call. They have properties, they can be passed and stored, and the
way one is written decides how it hoists, what `this` it gets and whether it can be used with
`new`.

### Four ways to write one

```javascript
function areaDecl(w, h) { return w * h }          // declaration
const areaExpr = function (w, h) { return w * h }  // expression
const areaArrow = (w, h) => w * h                  // arrow
const shape = { area(w, h) { return w * h } }      // method shorthand
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

### Parameters are optional by default

JavaScript never checks how many arguments you passed. Missing ones are `undefined`; extra ones
are dropped.

```javascript
const greet = (name, greeting) => `${greeting}, ${name}`
greet('Ada')               // "undefined, Ada"
greet('Ada', 'Hi', 'x')    // "Hi, Ada"
```

#### Defaults

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

#### Rest and destructuring

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

### What length reports

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

### Return

A function without a `return`, or with a bare `return;`, gives back `undefined`. A constructor
called with `new` is the one exception: it returns the new object unless it explicitly returns a
different object.

Two traps with the syntax:

```javascript
const makeBroken = () => { id: 1 }     // undefined: the braces are a block, `id:` a label
const makeFixed = () => ({ id: 1 })    // { id: 1 }

function total() {
  return          // automatic semicolon insertion ends the statement here
    1 + 2         // never reached; total() is undefined
}
```

Put the returned expression on the same line as `return`, or open a parenthesis there.

### What to take away

- Declarations hoist; expressions and arrows are only as available as their variable.
- Missing arguments are `undefined`, and a default replaces `undefined` but not `null`.
- Defaults are evaluated per call, so `= []` is safe.
- Use rest parameters, not `arguments`.
- `length` counts parameters up to the first default or rest.

### The exercise

Four small functions, each with a parameter or return bug from this section. Fix them.

1. `request(url, options)` returns `{ url, method, options }`. `method` comes from the options and
   defaults to `'GET'` when it is missing or `undefined`, but a `method` of `null` is kept as
   `null`: the caller said something, even if it was odd. `options` holds every *other* option,
   without `method`. Calling `request(url)` with no options must work, and `request.length` must
   be `1`, because the options are optional.
2. `sum(...numbers)` adds any number of arguments. `sum()` is `0`, and `sum.length` is `0`.
3. `makeUser(name)` returns `{ name, active: true }`. It currently returns `undefined`.
4. `collect(item, into)` pushes `item` onto `into` and returns it. With no `into`, each call starts
   a fresh array; at the moment every call without one shares the same array.

## file functions.js

```javascript
// 1. { url, method, options }. method defaults to 'GET' for undefined, not null.
export function request(url, options) {
  const method = options.method || 'GET'
  return { url, method, options }
}

// 2. Adds every argument. sum() is 0.
export const sum = numbers => numbers.reduce((total, n) => total + n, 0)

// 3. { name, active: true }
export const makeUser = name => {
  name: name
}

// 4. A fresh array per call when into is not given.
const bucket = []
export function collect(item, into = bucket) {
  into.push(item)
  return into
}
```

## solution

```javascript
export function request(url, { method = 'GET', ...options } = {}) {
  return { url, method, options }
}

export const sum = (...numbers) => numbers.reduce((total, n) => total + n, 0)

export const makeUser = name => ({ name, active: true })

export function collect(item, into = []) {
  into.push(item)
  return into
}
```

## explanation

`request` destructures its second parameter, so `method` gets a real default and `...options`
gathers the rest without it. `|| 'GET'` and `?? 'GET'` both replace `null`; a parameter default
replaces only `undefined`, which is the rule the check asks for. The `= {}` on the whole pattern
is what lets `request(url)` run: without it, destructuring `undefined` throws. A default also stops
`length` counting, so `request.length` drops from 2 to 1.

`sum` needs a rest parameter to collect its arguments into an array. The starter took one argument
and called `reduce` on it, which only works if the caller passes an array.

`makeUser` is the arrow-body trap. `{` after `=>` starts a block, `name:` is a label, and a block
with no `return` gives `undefined`. Wrapping the object in parentheses makes it an expression.

`collect` shared one module-level array between every call that relied on the default. A default
expression runs on each call, so `into = []` gives each call its own, which is the Python mutable
default problem that JavaScript does not have unless you build it yourself.

## check request defaults method when it is missing or undefined

A default applies for undefined, whether passed or omitted.

```javascript
assert.strictEqual(request('/a', {}).method, 'GET')
assert.strictEqual(request('/a', { method: undefined }).method, 'GET')
assert.strictEqual(request('/a', { method: 'POST' }).method, 'POST')
```

## check request keeps a null method

null is a value the caller passed, and a default does not replace it.

```javascript
assert.strictEqual(request('/a', { method: null }).method, null)
```

## check request collects the other options without method

The rest of the options, and nothing else.

```javascript
assert.deepStrictEqual(request('/users', { method: 'POST', body: 'x', retries: 2 }), {
  url: '/users',
  method: 'POST',
  options: { body: 'x', retries: 2 },
})
```

## check request works with no options at all

Destructuring undefined throws unless the whole parameter has a default.

```javascript
assert.deepStrictEqual(request('/health'), { url: '/health', method: 'GET', options: {} })
```

## check request reports one expected argument

length stops at the first default.

```javascript
assert.strictEqual(request.length, 1)
```

## check sum adds any number of arguments

Including none.

```javascript
assert.strictEqual(sum(1, 2, 3), 6)
assert.strictEqual(sum(5), 5)
assert.strictEqual(sum(), 0)
assert.strictEqual(sum.length, 0)
```

## check makeUser returns the object

Not undefined from a block body.

```javascript
assert.deepStrictEqual(makeUser('Ada'), { name: 'Ada', active: true })
```

## check collect starts a fresh array on every call

Default expressions run per call.

```javascript
assert.deepStrictEqual(collect(1), [1])
assert.deepStrictEqual(collect(2), [2])
const mine = [0]
assert.strictEqual(collect(3, mine), mine)
assert.deepStrictEqual(mine, [0, 3])
```

## hint after 1

Put the default in the parameter list: `function request(url, { method = 'GET', ...options } = {})`.

## hint after 2

A rest parameter, `(...numbers) =>`, gathers every argument into a real array.

## hint after 3

Wrap an object returned from an arrow in parentheses: `name => ({ name, active: true })`. For
`collect`, make the default `[]` itself.
