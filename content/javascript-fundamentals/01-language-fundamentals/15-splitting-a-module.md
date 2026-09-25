---
type: exercise
title: Splitting a Module
description: Two module systems, how a specifier resolves, live bindings, and a module split into files
entry: progress.js
minutes: 35
difficulty: medium
files:
  - name: format.js
    language: javascript
    readonly: true
  - name: tracker.js
    language: javascript
    readonly: true
  - name: progress.js
    language: javascript
---

JavaScript has two module systems, and a Node project still meets both. ES modules (ESM) are the
language standard, and the only kind a browser runs. CommonJS (CJS) is what Node shipped with in
2009, and a large share of npm is still published in it.

```javascript
// ESM
import { readFile } from 'node:fs/promises'
export function load(path) { … }
export default load

// CommonJS
const { readFile } = require('node:fs/promises')
function load(path) { … }
module.exports = { load }
```

### The differences that matter

| | ESM | CommonJS |
| --- | --- | --- |
| Syntax | `import` / `export` | `require()` / `module.exports` |
| When dependencies load | Before any code runs, from a static graph | When `require` is called, one at a time |
| Loading | Asynchronous | Synchronous |
| What you import | A live binding | Properties of one shared, cached `module.exports` object; destructuring copies them |
| Strict mode | Always | Only with `'use strict'` |
| Top-level `await` | Yes | No |
| `this` at the top level | `undefined` | `module.exports` |
| Current file | `import.meta.url`, `import.meta.dirname` | `__filename`, `__dirname` |

The first two rows drive most of the rest. An `import` statement must sit at the top level with a
string literal specifier, so the engine can read every import in the graph, fetch and link them,
and only then start running code. That static shape is also what lets a bundler tree-shake: it can
prove an export is never imported and drop it.

`require` is an ordinary function call. It can sit inside an `if`, take a computed path, and run
halfway through a file. That flexibility is exactly what makes CJS impossible to analyse ahead of
time.

### How a specifier resolves

The string after `from` is a specifier. There are three kinds.

- **Relative**, `'./format.js'` or `'../lib/date.js'`: resolved against the importing file's URL.
  In a browser and in Node ESM, the extension is required. Only CJS and bundlers guess it.
- **Absolute URL**, `'https://…'` or `'node:fs'`: used as it is. The `node:` prefix names a Node
  built-in unambiguously and is worth always writing.
- **Bare**, `'react'` or `'zod/v4'`: a package name. Node walks up the directories looking in each
  `node_modules`. Browsers cannot resolve bare specifiers without an import map, which is one of the
  jobs a bundler like Vite does for you.

For a package, Node reads its `package.json`. The `exports` field, if present, is the whole public
surface: it maps subpaths like `'zod/v4'` to files, can give different files to `import` and
`require`, and makes every unlisted file unreachable.

Which system a `.js` file uses is decided by the nearest `package.json`. `"type": "module"` makes
`.js` mean ESM; without it, `.js` means CJS. `.mjs` is always ESM and `.cjs` always CommonJS,
whatever the package says.

### Live bindings

An ESM import is not a variable holding a copy. It is a read-only view onto the exporting module's
variable.

```javascript
// counter.js
export let count = 0
export function increment() {
  count++
}

// main.js
import { count, increment } from './counter.js'
count        // 0
increment()
count        // 1, the importer sees the change
count = 5    // TypeError: Assignment to constant variable.
```

Only the owning module can assign it; everyone else reads the current value. The CommonJS
equivalent behaves differently, because destructuring `require` copies properties off an object:

```javascript
const { count, increment } = require('./counter.cjs')
increment()
count   // still 0
```

Live bindings are what make circular imports survivable in ESM. If `a.js` imports `b.js` and
`b.js` imports `a.js`, each gets a binding to the other's exports that fills in once that module
has run. Reading a `let`, `const` or `class` export before then hits the dead zone and throws,
which is loud. Function declarations are hoisted and work straight away. CJS hands back a
half-built `module.exports` object instead, which is quiet.

### Using one from the other

- **ESM importing CJS** works. `module.exports` arrives as the default export, and Node
  also guesses named exports by scanning the source, which usually works for simple
  `exports.name = …` files.
- **CJS requiring ESM** works in current Node (22.12 and later, so Node 24 here), as long as the
  ESM graph has no top-level `await`. Before that, CJS could only reach ESM through dynamic
  `import()`, which the next section covers.

New code should be ESM. You write CJS now mostly when a tool's config file demands it.

### What to take away

- ESM is static: the whole graph is known and linked before code runs. CJS loads as it goes.
- Relative specifiers need their extension outside a bundler.
- `"type": "module"`, `.mjs` and `.cjs` decide which system a file uses.
- An ESM import is a live, read-only binding. `require` returns the shared `module.exports`
  object, and destructuring it copies the values out.
- A package's `exports` field is its public API; nothing else in it can be imported.

### The exercise

Three modules. **format.js** and **tracker.js** are written and read only; **progress.js** is
yours.

`format.js` exports `percent(part, whole)` and `pluralise(count, word)`. Import both rather than
rewriting them — that is the point of splitting a module.

In **progress.js**:

1. Export `summarise(completed, total)`, reading `3 of 4 lessons complete (75%)`. A total of `0`
   returns `Nothing to do yet` instead, because dividing by it is meaningless.
2. Export `isFinished(completed, total)`, true only when there is something to finish and it is
   all done.
3. Export `report(total)`, the `summarise` sentence for however many lessons `tracker.js` has
   counted *so far*. `tracker.js` exports a live `completed` count and a `complete()` that adds one.
   The starter copies `completed` into a `const` when the module loads, which is how a destructured
   `require` behaves, so it never sees a change. The checks drive the tracker through the
   `complete` and `resetTracker` that `progress.js` re-exports; leave that line as it is.

## file format.js

```javascript
// Written for you, and not editable. Import from it.

/** part as a whole-number percentage of whole. */
export const percent = (part, whole) => Math.round((part / whole) * 100)

/** "1 lesson", "2 lessons". */
export const pluralise = (count, word) => (count === 1 ? word : `${word}s`)
```

## file tracker.js

```javascript
// Written for you, and not editable. It owns the count; only it can change it.

export let completed = 0

export function complete() {
  completed++
}

export function resetTracker() {
  completed = 0
}
```

## file progress.js

```javascript
// Import percent and pluralise from ./format.js rather than writing them again.
import { completed } from './tracker.js'

// Re-exported so the checks can drive the tracker. Leave this line as it is.
export { complete, resetTracker } from './tracker.js'

// 1. "3 of 4 lessons complete (75%)", or "Nothing to do yet" when total is 0.
export function summarise(completed, total) {
  return ''
}

// 2. True only when total is above zero and everything is done.
export function isFinished(completed, total) {
  return false
}

// 3. The summary for however many lessons the tracker has counted so far.
const done = completed
export function report(total) {
  return summarise(done, total)
}
```

## solution

```javascript
import { percent, pluralise } from './format.js'
import { completed } from './tracker.js'

export { complete, resetTracker } from './tracker.js'

export function summarise(completed, total) {
  if (total === 0) return 'Nothing to do yet'
  return `${completed} of ${total} ${pluralise(total, 'lesson')} complete (${percent(completed, total)}%)`
}

export function isFinished(completed, total) {
  return total > 0 && completed >= total
}

export function report(total) {
  return summarise(completed, total)
}
```

## explanation

The import specifier is `'./format.js'`, with the extension. Browsers resolve module specifiers as
URLs, so the extension is not optional the way a bundler has trained you to expect.

`summarise` guards `total === 0` first. `percent(0, 0)` is `NaN`, and `NaN%` in the interface is
the sort of bug that survives a demo and turns up in a screenshot from a user.

`isFinished` checks `total > 0` for the same reason: nothing to do is not the same as finished, and
`0 >= 0` would otherwise call an empty course complete.

`report` reads the imported `completed` at the moment it is called. An ESM import is a live view
onto `tracker.js`'s variable, so each `complete()` is visible straight away. The starter's
`const done = completed` ran once, when `progress.js` loaded, and kept the `0` it saw then: the
same result as `const { completed } = require('./tracker.cjs')` in CommonJS. The fix is to delete
the copy, not to add a counter of your own; the tracker owns the count, and `progress.js` cannot
assign to `completed` in any case.

The parameters of `summarise` and `isFinished` are also called `completed`. Inside those functions
they shadow the import, which is why they still describe whatever numbers they are given.

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

## check report follows the tracker as it counts

A live binding sees every complete().

```javascript
resetTracker()
assert.strictEqual(report(4), '0 of 4 lessons complete (0%)')
complete()
complete()
assert.strictEqual(report(4), '2 of 4 lessons complete (50%)')
```

## check report keeps following after a reset

The tracker can go down as well as up.

```javascript
resetTracker()
complete()
complete()
complete()
assert.strictEqual(report(3), '3 of 3 lessons complete (100%)')
resetTracker()
assert.strictEqual(report(3), '0 of 3 lessons complete (0%)')
assert.strictEqual(report(0), 'Nothing to do yet')
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

## hint after 4

Delete `const done = completed` and use `completed` inside `report`. The import is already live.
