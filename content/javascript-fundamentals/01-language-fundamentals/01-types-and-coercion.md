---
type: lesson
title: Types and Coercion
description: The seven primitives, what typeof actually reports, and when JavaScript converts behind your back
access: free
---

JavaScript has seven primitive types and one everything-else.

```javascript
typeof 'text'        // "string"
typeof 42            // "number"
typeof 10n           // "bigint"
typeof true          // "boolean"
typeof undefined     // "undefined"
typeof Symbol()      // "symbol"
typeof null          // "object"  ← wrong, and permanent
typeof {}            // "object"
typeof (() => {})    // "function"  ← also not a type
```

Two of those lines are lies worth knowing.

`typeof null === "object"` is a bug from 1995 that cannot be fixed without breaking the web. Test
for null with `value === null`.

`typeof fn === "function"` is a convenience: functions are objects, and this is the one case where
`typeof` reports something other than the real type.

## Checking a type properly

`typeof` answers most questions. For the rest:

```javascript
Array.isArray([])                                  // true
Number.isNaN(NaN)                                  // true, unlike the global isNaN
Object.prototype.toString.call(null)               // "[object Null]"
```

`Object.prototype.toString` is the only mechanism that distinguishes every built-in, which is why
you still see it in library code.
