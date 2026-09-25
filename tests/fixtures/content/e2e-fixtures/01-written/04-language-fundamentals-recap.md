---
type: recap
title: Language Fundamentals Recap
description: What to carry forward from types, coercion and modules
---

Types are few and mostly well behaved; the exceptions are worth memorising rather than deriving.
Coercion is not the enemy, but implicit coercion in a condition is, because the wrong answer still
looks like a working program. Modules resolve as URLs, so the file extension is part of the name.

## key points

- Seven primitives, and everything else is an object.
- `typeof null` is `"object"`. Test with `value === null`, first, before anything else.
- `typeof fn` is `"function"`, which is a convenience rather than a real type.
- `Array.isArray` is the only array test that survives crossing a realm.
- `Number('')` and `Number(null)` are both `0`, which is almost never what the caller meant.
- `Number.isNaN` does not coerce; the global `isNaN` does, so `isNaN('abc')` is true.
- A bare truthiness check treats `0` and `''` as absent. Say what you mean instead.
- Import specifiers are URLs: `'./format.js'` needs its extension in the browser.
