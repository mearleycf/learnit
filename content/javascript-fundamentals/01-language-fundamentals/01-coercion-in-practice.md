---
type: exercise
title: Coercion in Practice
description: The seven primitives, what typeof actually reports, and helpers that make JavaScript's conversions explicit
entry: coercion.js
access: free
minutes: 25
difficulty: medium
files:
  - name: coercion.js
    language: javascript
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
typeof NaN           // "number"  ← "not a number" is a number
```

Three of those lines are lies worth knowing.

`typeof null === "object"` is a bug from 1995 that cannot be fixed without breaking the web. Test
for null with `value === null`.

`typeof fn === "function"` is a convenience: functions are objects, and this is the one case where
`typeof` is more specific than the real type.

`typeof NaN === "number"` is correct by the spec, since `NaN` is a value of the number type, and
useless in practice: a "number" you cannot do arithmetic with.

### Checking a type properly

`typeof` answers most questions. For the rest:

```javascript
Array.isArray([])                                  // true
Number.isNaN(NaN)                                  // true, unlike the global isNaN
Object.prototype.toString.call(null)               // "[object Null]"
```

The global `isNaN` converts its argument to a number first, so `isNaN('abc')` is `true`.
`Number.isNaN` does not convert, and is true only for `NaN` itself.

`Object.prototype.toString` is the only mechanism that distinguishes every built-in, which is why
you still see it in library code.

### The exercise

Three helpers that make JavaScript's conversions explicit rather than implicit.

1. `typeOf(value)` behaves like `typeof`, except it returns `"null"` for null, `"array"` for an
   array and `"nan"` for `NaN`. Everything else reports as `typeof` does.
2. `toNumber(value)` converts a numeric string to a number, and returns `null` for anything that
   is not a number. Note that `Number('')` is `0` and `Number(null)` is `0`, which is almost
   never what a caller wants.
3. `isEmpty(value)` is true for `''`, `[]` and `{}`, and false for `0` and `false`. A bare
   truthiness check gets the last two wrong.

## file coercion.js

```javascript
// 1. Like typeof, but "null" for null, "array" for an array and "nan" for NaN.
export function typeOf(value) {
  return typeof value
}

// 2. A number, or null when the value is not one.
export function toNumber(value) {
  return Number(value)
}

// 3. True for '', [] and {}. False for 0 and false.
export function isEmpty(value) {
  return !value
}
```

## solution

```javascript
export function typeOf(value) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (Number.isNaN(value)) return 'nan'
  return typeof value
}

export function toNumber(value) {
  if (typeof value === 'number') return Number.isNaN(value) ? null : value
  if (typeof value !== 'string' || value.trim() === '') return null

  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export function isEmpty(value) {
  if (typeof value === 'string') return value.length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object' && value !== null) return Object.keys(value).length === 0
  return false
}
```

## explanation

The null check has to come first in `typeOf`, because `typeof null` is `"object"` and would
otherwise win. `Array.isArray` is the only reliable array test; `instanceof Array` fails across
realms such as an iframe. `Number.isNaN` is the right NaN test because it does not convert: the
global `isNaN('abc')` is `true`, which would report every non-numeric string as `"nan"`.

`toNumber` guards the empty string and null explicitly, because both coerce to `0` rather than
`NaN`. That single behaviour is behind a great many form bugs, where a blank field silently
becomes zero.

`isEmpty` returns false for anything that is not a string, array or object, which is what makes
`0` and `false` behave. Reversing that, and returning `!value`, is the version people write first
and regret later.

## check typeOf reports null as null

typeof null is "object", which this should correct.

```javascript
assert.strictEqual(typeOf(null), 'null')
```

## check typeOf reports an array as array

typeof [] is also "object".

```javascript
assert.strictEqual(typeOf([1, 2]), 'array')
```

## check typeOf reports NaN as nan

typeof NaN is "number", which is true and unhelpful.

```javascript
assert.strictEqual(typeOf(NaN), 'nan')
assert.strictEqual(typeOf(0 / 0), 'nan')
```

## check typeOf still handles the ordinary cases

Strings, numbers, functions and undefined report as themselves. A string that is not numeric is
still a string, not NaN.

```javascript
assert.strictEqual(typeOf('x'), 'string')
assert.strictEqual(typeOf('abc'), 'string')
assert.strictEqual(typeOf(1), 'number')
assert.strictEqual(typeOf(undefined), 'undefined')
assert.strictEqual(typeOf({}), 'object')
assert.strictEqual(typeOf(() => {}), 'function')
```

## check toNumber parses a numeric string

A clean numeric string becomes a number.

```javascript
assert.strictEqual(toNumber('42'), 42)
```

## check toNumber rejects anything that is not a number

Returns null rather than NaN, so the caller can branch on it.

```javascript
assert.strictEqual(toNumber('abc'), null)
assert.strictEqual(toNumber(''), null)
assert.strictEqual(toNumber(null), null)
```

## check isEmpty treats empty string, array and object as empty

All three are empty.

```javascript
assert.strictEqual(isEmpty(''), true)
assert.strictEqual(isEmpty([]), true)
assert.strictEqual(isEmpty({}), true)
```

## check isEmpty does not treat zero or false as empty

This is where a bare truthiness check goes wrong.

```javascript
assert.strictEqual(isEmpty(0), false)
assert.strictEqual(isEmpty(false), false)
```

## hint after 1

Test for `null` first, then `Array.isArray(value)`, then `Number.isNaN(value)`, and only then
fall back to `typeof value`.

## hint after 2

`Number('')` is `0` and `Number(null)` is `0`, so check for those before converting.

## hint after 3

`isEmpty` needs three branches: string, array, then plain object via `Object.keys`.
