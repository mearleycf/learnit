---
type: lesson
title: "Equality and Comparison"
description: "Why == has a conversion table, when Object.is differs from ===, and what relational operators do"
---

JavaScript has three equality algorithms, and each operator picks one.

| Operator | Algorithm | Converts types? |
| --- | --- | --- |
| `==` | Loose equality | Yes, by a fixed table |
| `===` | Strict equality | No |
| `Object.is` | SameValue | No, and handles `NaN` and `-0` differently |

`includes`, `Map` keys and `Set` membership use a fourth, SameValueZero, which is `Object.is`
except that `0` and `-0` are equal.

## What == actually does

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
`== true` gets false for every value except `'1'`.

## The one == worth keeping

Step 2 makes `value == null` a precise test for "null or undefined", and nothing else. `0`, `''`
and `false` all fail it.

```javascript
if (value == null) return fallback
```

That line is idiomatic, and linters that ban `==` usually carve out an exception for it. Every
other comparison should be `===`.

## Where === and Object.is disagree

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

## Objects compare by identity

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

## Relational operators

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
