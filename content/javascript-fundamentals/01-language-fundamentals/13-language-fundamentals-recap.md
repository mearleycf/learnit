---
type: recap
title: Language Fundamentals Recap
description: What to carry forward from types and equality, scope and closures, functions and this, errors and modules
---

Types are few and mostly well behaved; the exceptions are worth memorising rather than deriving.
Names resolve by where code is written, except `this`, which is decided by how a function is
called. Closures keep scope alive, objects are shared by reference, and `catch` takes everything
unless you narrow it. Modules resolve as URLs, run once, and export live bindings.

## key points

- `typeof null` is `"object"`. Test with `value === null`, and use `Array.isArray` for arrays.
- `Number('')` and `Number(null)` are both `0`. A bare truthiness check treats `0` and `''` as
  absent.
- Use `===` everywhere except `value == null`. `Object.is` differs only on `NaN` and `-0`.
- Default `sort` compares as strings. Pass a comparator for numbers.
- Function declarations are callable before their line; `let` and `const` throw in the dead zone.
- A closure holds variables, not values, and keeps whatever it mentions alive.
- `const` stops reassignment, not mutation. A spread copies one level; nested objects stay shared.
- Parameter defaults replace `undefined`, not `null`, and are evaluated per call.
- `this` comes from the call site. Passing `obj.method` as a value loses `obj`; arrows opt out.
- Throw `Error` objects, wrap with `cause`, rethrow what you do not handle, never return from
  `finally`.
- Give failures their own `Error` subclass so callers branch with `instanceof`, not on a message.
- Import specifiers are URLs: `'./format.js'` needs its extension outside a bundler.
- An ESM import is a live, read-only binding. Destructuring a CommonJS `require` copies values off
  a shared object.
- Each module evaluates once. Keep its top level to declarations and export the work as functions.
