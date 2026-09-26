---
type: exercise
title: "Equality and Comparison"
description: "Why == has a conversion table, when Object.is differs from ===, and what relational operators do"
entry: equality.js
minutes: 25
difficulty: medium
files:
  - name: equality.js
    language: javascript
---

JavaScript has three equality algorithms, and each operator picks one.

| Operator | Algorithm | Converts types? |
| --- | --- | --- |
| `==` | Loose equality | Yes, by a fixed table |
| `===` | Strict equality | No |
| `Object.is` | SameValue | No, and handles `NaN` and `-0` differently |

`includes`, `Map` keys and `Set` membership use a fourth, SameValueZero, which is `Object.is`
except that `0` and `-0` are equal.

### What == actually does

Loose equality is not guesswork. It is a short, fixed list of steps, applied in order:

1. Same type? Compare as `===` would.
2. `null` and `undefined` equal each other, and nothing else.
3. Number against string: convert the string to a number.
4. A boolean on either side: convert the boolean to a number first.
5. An object against a primitive: convert the object with `valueOf`, then `toString`.

Step 4 is where the famous results come from.

```javascript
'1' == 1          // true   (step 3: '1' → 1)
true == 1         // true   (step 4: true → 1)
true == '1'       // true   (true → 1, then '1' → 1)
true == 'true'    // false  (true → 1, 'true' → NaN)
[] == false       // true   (false → 0, [] → '' → 0)
[] == ![]         // true   (the same thing, with a ! in front)
null == 0         // false  (step 2: null only equals undefined)
null >= 0         // true   (relational operators do not use step 2)
```

`true == 'true'` being false is the one that ships bugs. Anyone comparing a query-string flag with
`== true` gets false for `'true'`, and true only for strings that convert to the number 1, such as
`'1'`.

### The one == worth keeping

Step 2 makes `value == null` a precise test for "null or undefined", and nothing else. `0`, `''`
and `false` all fail it.

```javascript
if (value == null) return fallback
```

That line is idiomatic, and linters that ban `==` usually carve out an exception for it. Every
other comparison should be `===`.

### Where === and Object.is disagree

Strict equality has two holes, both in the number type.

```javascript
NaN === NaN              // false
Object.is(NaN, NaN)      // true

0 === -0                 // true
Object.is(0, -0)         // false
```

`NaN` is the only value not equal to itself, which is why `Number.isNaN` exists. `-0` turns up
from `Math.round(-0.4)` or `-1 * 0`, and `1 / -0` is `-Infinity`, so the sign can matter. React
compares state with `Object.is` for exactly these reasons.

```javascript
[NaN].indexOf(NaN)       // -1  (indexOf uses ===)
[NaN].includes(NaN)      // true (includes uses SameValueZero)
```

### Objects compare by identity

None of the operators look inside an object. Two objects are equal only when they are the same
object.

```javascript
{} === {}                      // false
[1, 2] === [1, 2]              // false

const a = { id: 1 }
const b = a
a === b                        // true, one object with two names
```

Structural comparison is your job: compare the fields, or serialise and compare strings when
key order is known. That identity rule is also why `new Set([{ id: 1 }, { id: 1 }])` has two
members.

### Relational operators

`<`, `>`, `<=` and `>=` convert both sides to primitives, then:

- Both strings: compare by UTF-16 code unit, character by character.
- Anything else: convert both to numbers.

```javascript
'10' < '9'          // true, '1' sorts before '9'
'10' < 9            // false, '10' → 10
'Z' < 'a'           // true, capitals come first in UTF-16
undefined < 1       // false, undefined → NaN
undefined >= 1      // false as well
```

Any comparison with `NaN` is false, so `a < b` being false does not mean `a >= b` is true.

The string rule is behind the default `sort`, which converts every element to a string:

```javascript
[10, 9, 1].sort()                     // [1, 10, 9]
[10, 9, 1].sort((a, b) => a - b)      // [1, 9, 10]
['é', 'z', 'a'].sort((a, b) => a.localeCompare(b))   // ['a', 'é', 'z']
```

Pass a comparator for numbers, and `localeCompare` for text a human will read.

### The exercise

Write the equality algorithms yourself, so the edge cases stop being trivia.

1. `sameValue(a, b)` behaves exactly like `Object.is`, **without calling it**: `NaN` equals `NaN`,
   `0` and `-0` are different, and everything else compares as `===` would.
2. `sameValueZero(a, b)` is the algorithm `includes`, `Map` and `Set` use: like `sameValue`,
   except `0` and `-0` are equal.
3. `looseEqualsNull(value)` is true for `null` and `undefined` and false for everything else,
   including `0`, `''`, `false` and `NaN`.

## file equality.js

```javascript
// 1. Object.is without Object.is: NaN equals NaN, 0 and -0 differ.
export function sameValue(a, b) {
  return a === b
}

// 2. What includes and Set use: like sameValue, but 0 and -0 are equal.
export function sameValueZero(a, b) {
  return a === b
}

// 3. True for null and undefined only.
export function looseEqualsNull(value) {
  return !value
}
```

## solution

```javascript
export function sameValue(a, b) {
  if (Number.isNaN(a)) return Number.isNaN(b)
  if (a === 0 && b === 0) return 1 / a === 1 / b
  return a === b
}

export function sameValueZero(a, b) {
  return a === b || (Number.isNaN(a) && Number.isNaN(b))
}

export function looseEqualsNull(value) {
  return value == null
}
```

## explanation

`===` is already right for every value except the two number oddities, so both functions start
from it and patch the holes.

`NaN` is the only value that is not `===` to itself, so `Number.isNaN` on both sides handles it.
`a !== a` is the older spelling of the same test, and works for the same reason. The global
`isNaN` would not do: it converts first, so `isNaN('abc')` is true and `sameValue('abc', NaN)`
would come out true.

`0 === -0` is true, so telling them apart needs an operation where the sign shows. Division is the
classic one: `1 / 0` is `Infinity` and `1 / -0` is `-Infinity`. That test is only safe once both
values are known to be zero; for anything else `1 / 'x'` is `NaN`, and `NaN === NaN` would make two
equal strings compare unequal.

`sameValueZero` is `===` plus the `NaN` fix, and nothing else, because `===` already treats `0` and
`-0` as equal.

`value == null` is the one loose comparison worth keeping. Step 2 of the `==` table makes `null`
and `undefined` equal each other and nothing else. `!value` is the tempting shortcut and it is
wrong for `0`, `''`, `false` and `NaN`.

## check sameValue treats NaN as equal to itself

The first hole in ===.

```javascript
assert.strictEqual(sameValue(NaN, NaN), true)
assert.strictEqual(sameValue(NaN, 0), false)
assert.strictEqual(sameValue(0, NaN), false)
```

## check sameValue tells 0 and -0 apart

The second hole in ===.

```javascript
assert.strictEqual(sameValue(0, -0), false)
assert.strictEqual(sameValue(-0, 0), false)
assert.strictEqual(sameValue(-0, -0), true)
assert.strictEqual(sameValue(0, 0), true)
```

## check sameValue compares everything else as === does

No conversion, and equal strings are still equal.

```javascript
assert.strictEqual(sameValue(1, 1), true)
assert.strictEqual(sameValue('x', 'x'), true)
assert.strictEqual(sameValue('1', 1), false)
assert.strictEqual(sameValue(null, undefined), false)
assert.strictEqual(sameValue(Infinity, -Infinity), false)
```

## check sameValue compares objects by identity

Two objects with the same contents are still two objects.

```javascript
const a = { id: 1 }
assert.strictEqual(sameValue(a, a), true)
assert.strictEqual(sameValue(a, { id: 1 }), false)
assert.strictEqual(sameValue([], []), false)
```

## check sameValue agrees with Object.is without calling it

Object.is is replaced for the duration of this check.

```javascript
const values = [0, -0, NaN, 1, '1', '', null, undefined, false, Infinity]
const expected = values.map(a => values.map(b => Object.is(a, b)))
const original = Object.is
Object.is = () => {
  throw new Error('sameValue called Object.is')
}
let actual
try {
  actual = values.map(a => values.map(b => sameValue(a, b)))
} finally {
  Object.is = original
}
assert.deepStrictEqual(actual, expected)
```

## check sameValueZero treats 0 and -0 as equal, and NaN as itself

The algorithm behind includes.

```javascript
assert.strictEqual(sameValueZero(0, -0), true)
assert.strictEqual(sameValueZero(NaN, NaN), true)
assert.strictEqual(sameValueZero('0', 0), false)
assert.strictEqual(sameValueZero({}, {}), false)
```

## check sameValueZero agrees with includes

Every pair, compared against what the built-in does.

```javascript
const values = [0, -0, NaN, 1, '1', '', null, undefined, false, Infinity]
for (const a of values) {
  for (const b of values) {
    assert.strictEqual(sameValueZero(a, b), [a].includes(b), `sameValueZero(${String(a)}, ${String(b)})`)
  }
}
```

## check looseEqualsNull catches null and undefined

The two values == null is for.

```javascript
assert.strictEqual(looseEqualsNull(null), true)
assert.strictEqual(looseEqualsNull(undefined), true)
```

## check looseEqualsNull lets every other falsy value through

A truthiness test gets all of these wrong.

```javascript
assert.strictEqual(looseEqualsNull(0), false)
assert.strictEqual(looseEqualsNull(''), false)
assert.strictEqual(looseEqualsNull(false), false)
assert.strictEqual(looseEqualsNull(NaN), false)
assert.strictEqual(looseEqualsNull({}), false)
```

## hint after 1

`value == null` is the whole of `looseEqualsNull`.

## hint after 2

Start from `a === b`. It is only wrong for `NaN`, and in `sameValue`, for a pair of zeros.

## hint after 3

```javascript
if (a === 0 && b === 0) return 1 / a === 1 / b
```
