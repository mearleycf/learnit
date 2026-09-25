---
type: lesson
title: "var, let and const"
description: "Three declarations, two scopes, and why const does not mean immutable"
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

## Function scope leaks out of blocks

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

## Redeclaration hides mistakes

```javascript
var total = 0
// … two hundred lines later …
var total = items.length   // silently the same variable
```

`let` and `const` refuse to declare a name twice in one scope, so the second line is a
SyntaxError that fails the whole file at parse time, before anything runs.

## var at the top of a script touches the global object

In a classic `<script>`, a top-level `var` becomes a property of `window`:

```javascript
var name = 'Ada'
window.name   // "Ada", and you have just overwritten the window's real name property
```

`let` and `const` at the top level create globals that are not properties of anything. ES modules
go further: their top level is module scope, so nothing declared there is global at all. Since
everything in this course is a module, this matters mainly when you read older code.

## const fixes the binding, not the value

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

## Why const is the default

`const` is not about immutability. It is about reading code: when every binding that changes is
a `let`, the `let`s are the only places you need to look to follow the state. A file of `const`
with two `let`s tells you where the moving parts are.

## What to take away

- `var` is function scoped, hoists as `undefined`, and redeclares silently. Avoid it.
- `let` and `const` are block scoped and throw before their line.
- `const` stops reassignment. It does not stop mutation.
- `Object.freeze` stops mutation, one level deep.
- Default to `const`; a `let` is a signal that the value moves.
