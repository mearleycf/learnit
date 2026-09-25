---
type: lesson
title: "Dynamic Import and Side Effects"
description: "Importing on demand, and what a module does the first time it is evaluated"
---

A static `import` is resolved before any code runs. `import()` is its runtime counterpart: an
expression you can call anywhere, with any string, that loads a module when you ask for it.

```javascript
const { marked } = await import('marked')
```

## import() returns a promise of the namespace

`import(specifier)` returns a promise that resolves to the module namespace object: every named
export as a property, and the default export under `default`.

```javascript
const chart = await import('./chart.js')
chart.render(data)      // a named export
chart.default           // the default export, if there is one
```

Because it is an expression rather than a statement, it can do everything static `import` cannot:

```javascript
// Conditionally
if (user.isAdmin) {
  const { AdminPanel } = await import('./admin.js')
  AdminPanel.mount(root)
}

// With a computed specifier
const messages = await import(`./locales/${lang}.js`)

// From CommonJS, which has no import statement
import('./esm-only.js').then(module => module.run())
```

A load failure, whether a missing file, a network error or a module that throws while running,
rejects the promise. Wrap the `await` in `try` as you would any other.

## Why you would reach for it

**Code splitting.** A bundler such as Vite treats every `import()` as a split point: the target
and everything only it depends on go into a separate chunk, fetched when the call runs. A
charting library the user sees on one page, a markdown editor behind a button, a heavy
admin-only route: none of them need to be in the first download.

**Loading what you cannot know in advance.** Plugins, locale files, a per-customer theme.

**Deferring an expensive start-up.** A module that builds a large table at the top level costs
that time whoever imports it. Importing it on first use moves the cost to when it is needed.

A computed specifier costs the bundler its certainty. Vite handles a template like
`` `./locales/${lang}.js` `` by bundling every file that could match, but a fully dynamic string
cannot be analysed at all and is left to the runtime.

## A module runs once

The first time a module is imported, statically or dynamically, the engine evaluates its top
level. The result is cached in the module map, keyed by the resolved URL. Every later import of
that URL, from anywhere, gets the same namespace without running the code again.

```javascript
// config.js
console.log('loading config')
export const settings = { theme: 'dark' }

// a.js and b.js both import './config.js'
// "loading config" prints once, and a and b share one settings object
```

That is what makes a module a natural singleton, and it is why mutating an exported object is
visible to every importer: there is only one.

The cache has two consequences worth knowing:

- Two specifiers that resolve to different URLs are two modules. `'./config.js'` and
  `'./config.js?v=2'` evaluate twice, which is the trick behind cache-busting and hot reload.
- There is no supported way to un-cache a module and run it again. If you need fresh state, export
  a function that creates it.

## Side effects

A side effect is anything the top level of a module does besides declaring things: registering a
custom element, patching a global, adding a listener, writing to `localStorage`, starting a timer.

Some modules exist only for their side effects, and are imported without naming anything:

```javascript
import './polyfills.js'
import './styles.css'   // in a bundler
```

Evaluation order follows the import graph depth first: a module's dependencies run before it
does, in the order its `import` statements are written, and each one only once. So a side-effect
import placed first really does run before the modules after it.

Side effects are also what stops tree-shaking. A bundler cannot drop an unused import if running
that module might change something. Packages declare `"sideEffects": false` in `package.json` to
promise that their modules are safe to skip, or list the files that are not. Get that wrong and a
polyfill silently disappears from the production build.

The practical rule: keep module top levels to declarations. Put the work in an exported function
the caller runs deliberately, such as `init()` or `register()`, so importing is always safe and
cheap, and the effect happens when someone asks for it.

## Top-level await

In an ES module, `await` works at the top level. The module does not finish evaluating until the
promise settles, and every module importing it waits too.

```javascript
// db.js
export const connection = await connect(process.env.DATABASE_URL)
```

That is convenient for a start-up step that genuinely must finish first, and a hazard anywhere
else: a slow request at the top level of a shared module delays everything that imports it. It is
also why `require` cannot load an ES module that uses it; a synchronous call has no way to wait.

## What to take away

- `import()` loads a module at runtime and resolves to its namespace, with the default under
  `default`.
- It is the split point bundlers use to keep code out of the first download.
- Each module URL is evaluated once and cached; every importer shares the result.
- Top-level side effects run on first import and block tree-shaking. Prefer exported functions.
- Top-level `await` makes every importer wait.
