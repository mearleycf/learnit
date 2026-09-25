---
type: exercise
title: "Dynamic Import and Side Effects"
description: "Importing on demand, and what a module does the first time it is evaluated"
entry: loader.js
minutes: 30
difficulty: medium
files:
  - name: loader.js
    language: javascript
---

A static `import` is resolved before any code runs. `import()` is its runtime counterpart: an
expression you can call anywhere, with any string, that loads a module when you ask for it.

```javascript
const { marked } = await import('marked')
```

The examples here use `await`, which pauses until the module has loaded. Promises and
`async`/`await` get their own sections in chapter 2; this one needs only that much.

### import() returns a promise of the namespace

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

### Why you would reach for it

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

### A module runs once

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

### Side effects

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

### Top-level await

In an ES module, `await` works at the top level. The module does not finish evaluating until the
promise settles, and every module importing it waits too.

```javascript
// db.js
export const connection = await connect(process.env.DATABASE_URL)
```

That is convenient for a start-up step that genuinely must finish first, and a hazard anywhere
else: a slow request at the top level of a shared module delays everything that imports it. It is
also why `require` cannot load an ES module that uses it; a synchronous call has no way to wait.

### What to take away

- `import()` loads a module at runtime and resolves to its namespace, with the default under
  `default`.
- It is the split point bundlers use to keep code out of the first download.
- Each module URL is evaluated once and cached; every importer shares the result.
- Top-level side effects run on first import and block tree-shaking. Prefer exported functions.
- Top-level `await` makes every importer wait.

### The exercise

Two loaders built on `import()`. Neither calls `import()` itself: each takes an `importer`, a
function with the same contract, `specifier => Promise<namespace>`. In the app you would pass
`specifier => import(specifier)`; the checks pass a fake that counts how often each module is
"evaluated", and can fail on demand.

1. `createLoader(importer)` returns `load(name)`. It imports `./plugins/<name>.js` and resolves
   to that module's **default export**. Each plugin is imported at most once per loader, even when
   `load` is called again before the first import has finished, so every caller shares one
   evaluation, as the module map would. A failed import is not remembered: the next `load` of that
   name tries again.
2. `loadLocale(lang, importer)` imports `./locales/<lang>.js` and resolves to its named export
   `messages`. If that import fails, it falls back to `./locales/en.js`. If `en` itself fails, the
   returned promise rejects with that error rather than trying forever.

## file loader.js

```javascript
// 1. load(name) resolves to ./plugins/<name>.js's default export, importing each name once.
export function createLoader(importer) {
  return async name => {
    const module = await importer(`./plugins/${name}.js`)
    return module
  }
}

// 2. The messages export of ./locales/<lang>.js, falling back to en when it fails.
export async function loadLocale(lang, importer) {
  try {
    return importer(`./locales/${lang}.js`).then(module => module.messages)
  } catch {
    return loadLocale('en', importer)
  }
}
```

## solution

```javascript
export function createLoader(importer) {
  const cache = new Map()

  return name => {
    if (!cache.has(name)) {
      const loading = importer(`./plugins/${name}.js`).then(module => module.default)
      cache.set(name, loading)
      loading.catch(() => {
        if (cache.get(name) === loading) cache.delete(name)
      })
    }
    return cache.get(name)
  }
}

export async function loadLocale(lang, importer) {
  try {
    const { messages } = await importer(`./locales/${lang}.js`)
    return messages
  } catch (error) {
    if (lang === 'en') throw error
    return loadLocale('en', importer)
  }
}
```

## explanation

`createLoader` caches the **promise**, not the plugin. Caching the result after an `await` leaves
a window: a second `load` that arrives while the first import is still in flight finds nothing in
the cache and imports again. Storing the promise the moment the import starts closes that window,
because every later caller gets the same pending promise and waits on it. That is exactly how the
module map behaves: one evaluation per URL, however many importers.

The `.then(module => module.default)` is the namespace rule. `import()` resolves to the namespace
object, and the default export is a property of it called `default`, not the namespace itself.

A rejected promise in the cache would make one network blip permanent, so the loader deletes its
entry when the import fails. The identity test guards against deleting a newer entry that a retry
has put there since. The `.catch` also marks the rejection as handled, so the cached copy never
reports as an unhandled rejection; the caller still sees the failure through the promise it was
given.

`loadLocale` is the rule from 1.9 about where `try` stops reaching, with a promise. The starter returned the
promise from inside the `try` without awaiting it, so the `try` had already finished by the time
the import failed, and the rejection went straight past the `catch` to the caller. `await` inside
the `try` brings the rejection back into it. The `lang === 'en'` guard is the base case: without
it, a missing English file would recurse until the stack ran out.

## check load resolves to the default export

Not the namespace object around it.

```javascript
const plugin = { name: 'chart' }
const load = createLoader(async () => ({ default: plugin, other: 1 }))
assert.strictEqual(await load('chart'), plugin)
```

## check load imports the right specifier

The name becomes ./plugins/<name>.js.

```javascript
const seen = []
const load = createLoader(async specifier => {
  seen.push(specifier)
  return { default: specifier }
})
await load('chart')
await load('table')
assert.deepStrictEqual(seen, ['./plugins/chart.js', './plugins/table.js'])
```

## check load evaluates each plugin once, even for overlapping calls

Both calls start before the first import has resolved.

```javascript
let evaluations = 0
const load = createLoader(async specifier => {
  evaluations++
  await new Promise(resolve => setTimeout(resolve, 20))
  return { default: { specifier } }
})
const [first, second] = await Promise.all([load('chart'), load('chart')])
const third = await load('chart')
assert.strictEqual(evaluations, 1)
assert.strictEqual(first, second)
assert.strictEqual(first, third)
```

## check load keeps separate plugins separate

One cache entry per name.

```javascript
let evaluations = 0
const load = createLoader(async specifier => {
  evaluations++
  return { default: specifier }
})
assert.strictEqual(await load('a'), './plugins/a.js')
assert.strictEqual(await load('b'), './plugins/b.js')
await load('a')
assert.strictEqual(evaluations, 2)
```

## check load does not remember a failed import

The first attempt fails, the second succeeds, the third uses the cache.

```javascript
let attempts = 0
const load = createLoader(async () => {
  attempts++
  if (attempts === 1) throw new TypeError('Failed to fetch')
  return { default: 'ready' }
})
let error
try {
  await load('flaky')
} catch (caught) {
  error = caught
}
assert.ok(error instanceof TypeError, 'the first failure did not reach the caller')
assert.strictEqual(await load('flaky'), 'ready')
assert.strictEqual(await load('flaky'), 'ready')
assert.strictEqual(attempts, 2)
```

## check loadLocale resolves to the messages export

From ./locales/<lang>.js.

```javascript
const seen = []
const messages = await loadLocale('fr', async specifier => {
  seen.push(specifier)
  return { messages: { hello: 'bonjour' }, default: 'wrong' }
})
assert.deepStrictEqual(messages, { hello: 'bonjour' })
assert.deepStrictEqual(seen, ['./locales/fr.js'])
```

## check loadLocale falls back to English when a locale is missing

The rejection has to be caught, which only happens if it is awaited inside the try.

```javascript
const seen = []
const messages = await loadLocale('xx', async specifier => {
  seen.push(specifier)
  if (specifier !== './locales/en.js') throw new TypeError(`Failed to fetch ${specifier}`)
  return { messages: { hello: 'hello' } }
})
assert.deepStrictEqual(messages, { hello: 'hello' })
assert.deepStrictEqual(seen, ['./locales/xx.js', './locales/en.js'])
```

## check loadLocale rejects when English fails too

Once, with the original error, not an endless retry.

```javascript
const failure = new TypeError('offline')
let calls = 0
let error
try {
  await loadLocale('de', async () => {
    calls++
    throw failure
  })
} catch (caught) {
  error = caught
}
assert.strictEqual(error, failure)
assert.strictEqual(calls, 2)
```

## hint after 1

Store the promise in a `Map` as soon as the import starts, before anything is awaited:
`cache.set(name, importer(specifier).then(module => module.default))`.

## hint after 2

Attach a `.catch` to the cached promise that deletes its entry, so a failed import can be tried
again.

## hint after 3

In `loadLocale`, `await` the import inside the `try`. A promise returned without `await` rejects
after the `try` has already finished. Stop at `en`.
