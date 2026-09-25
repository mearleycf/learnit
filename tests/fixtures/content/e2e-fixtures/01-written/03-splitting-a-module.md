---
type: exercise
title: Splitting a Module
description: Import from a sibling file, and keep each module responsible for one thing
entry: progress.js
minutes: 25
difficulty: medium
files:
  - name: format.js
    language: javascript
    readonly: true
  - name: progress.js
    language: javascript
---

Two modules. **format.js** is written and read only; **progress.js** is yours.

`format.js` exports `percent(part, whole)` and `pluralise(count, word)`. Import both rather than
rewriting them — that is the point of splitting a module.

In **progress.js**:

1. Export `summarise(completed, total)`, reading `3 of 4 lessons complete (75%)`. A total of `0`
   returns `Nothing to do yet` instead, because dividing by it is meaningless.
2. Export `isFinished(completed, total)`, true only when there is something to finish and it is
   all done.

## file format.js

```javascript
// Written for you, and not editable. Import from it.

/** part as a whole-number percentage of whole. */
export const percent = (part, whole) => Math.round((part / whole) * 100)

/** "1 lesson", "2 lessons". */
export const pluralise = (count, word) => (count === 1 ? word : `${word}s`)
```

## file progress.js

```javascript
// Import percent and pluralise from ./format.js rather than writing them again.

// 1. "3 of 4 lessons complete (75%)", or "Nothing to do yet" when total is 0.
export function summarise(completed, total) {
  return ''
}

// 2. True only when total is above zero and everything is done.
export function isFinished(completed, total) {
  return false
}
```

## solution

```javascript
import { percent, pluralise } from './format.js'

export function summarise(completed, total) {
  if (total === 0) return 'Nothing to do yet'
  return `${completed} of ${total} ${pluralise(total, 'lesson')} complete (${percent(completed, total)}%)`
}

export function isFinished(completed, total) {
  return total > 0 && completed >= total
}
```

## explanation

The import specifier is `'./format.js'`, with the extension. Browsers resolve module specifiers as
URLs, so the extension is not optional the way a bundler has trained you to expect.

`summarise` guards `total === 0` first. `percent(0, 0)` is `NaN`, and `NaN%` in the interface is
the sort of bug that survives a demo and turns up in a screenshot from a user.

`isFinished` checks `total > 0` for the same reason: nothing to do is not the same as finished, and
`0 >= 0` would otherwise call an empty course complete.

## check summarise reads as a sentence

Four lessons, three done, three quarters of the way there.

```javascript
assert.strictEqual(summarise(3, 4), '3 of 4 lessons complete (75%)')
```

## check summarise pluralises the count it is describing

One lesson in total, so "lesson", not "lessons".

```javascript
assert.strictEqual(summarise(0, 1), '0 of 1 lesson complete (0%)')
```

## check summarise refuses to divide by zero

An empty course says so rather than reporting NaN.

```javascript
assert.strictEqual(summarise(0, 0), 'Nothing to do yet')
```

## check isFinished is true only when the work is done

Everything complete, and there was something to complete.

```javascript
assert.strictEqual(isFinished(4, 4), true)
assert.strictEqual(isFinished(3, 4), false)
```

## check isFinished does not call an empty course complete

Nothing to do is not the same as finished.

```javascript
assert.strictEqual(isFinished(0, 0), false)
```

## hint after 1

```javascript
import { percent, pluralise } from './format.js'
```

## hint after 2

Handle `total === 0` before you divide. `percent(0, 0)` is `NaN`, not `0`.

## hint after 3

```javascript
`${completed} of ${total} ${pluralise(total, 'lesson')} complete (${percent(completed, total)}%)`
```
