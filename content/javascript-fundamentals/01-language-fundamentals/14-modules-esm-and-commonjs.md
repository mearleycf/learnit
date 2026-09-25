---
type: lesson
title: "Modules: ESM and CommonJS"
description: "Two module systems, how a specifier resolves, and what a live binding means"
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

## The differences that matter

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

## How a specifier resolves

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

## Live bindings

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

## Using one from the other

- **ESM importing CJS** works. `module.exports` arrives as the default export, and Node
  also guesses named exports by scanning the source, which usually works for simple
  `exports.name = …` files.
- **CJS requiring ESM** works in current Node (22.12 and later, so Node 24 here), as long as the
  ESM graph has no top-level `await`. Before that, CJS could only reach ESM through dynamic
  `import()`, which the next section covers.

New code should be ESM. You write CJS now mostly when a tool's config file demands it.

## What to take away

- ESM is static: the whole graph is known and linked before code runs. CJS loads as it goes.
- Relative specifiers need their extension outside a bundler.
- `"type": "module"`, `.mjs` and `.cjs` decide which system a file uses.
- An ESM import is a live, read-only binding. `require` returns the shared `module.exports`
  object, and destructuring it copies the values out.
- A package's `exports` field is its public API; nothing else in it can be imported.
