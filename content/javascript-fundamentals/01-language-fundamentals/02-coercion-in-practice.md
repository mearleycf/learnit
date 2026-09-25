---
type: exercise
title: Coercion in Practice
description: Predict and control JavaScript's conversions instead of being surprised by them
entry: coercion.js
minutes: 20
difficulty: medium
files:
  - name: coercion.js
    language: javascript
---

Three helpers that make JavaScript's conversions explicit rather than implicit.

1. `typeOf(value)` behaves like `typeof`, except it returns `"null"` for null and `"array"` for
   an array. Everything else reports as `typeof` does.
2. `toNumber(value)` converts a numeric string to a number, and returns `null` for anything that
   is not a number. Note that `Number('')` is `0` and `Number(null)` is `0`, which is almost
   never what a caller wants.
3. `isEmpty(value)` is true for `''`, `[]` and `{}`, and false for `0` and `false`. A bare
   truthiness check gets the last two wrong.

## file coercion.js

```javascript
// 1. Like typeof, but "null" for null and "array" for an array.
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
realms such as an iframe.

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

## check typeOf still handles the ordinary cases

Strings, numbers and functions report as themselves.

```javascript
assert.strictEqual(typeOf('x'), 'string')
assert.strictEqual(typeOf(1), 'number')
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

```javascript
Array.isArray(value) ? 'array' : typeof value
```

## hint after 2

`Number('')` is `0` and `Number(null)` is `0`, so check for those before converting.

## hint after 3

`isEmpty` needs three branches: string, array, then plain object via `Object.keys`.
