---
type: exercise
title: "Errors, throw and try"
description: "What throwing costs, what catch actually catches, and why finally runs anyway"
entry: errors.js
minutes: 25
difficulty: medium
files:
  - name: errors.js
    language: javascript
---

`throw` stops the current function and unwinds the call stack until something catches. Nothing
about that is unusual. What is worth knowing is what JavaScript lets you throw, how
indiscriminate `catch` is, and where `try` stops reaching.

### Throw Error objects

You can throw anything: a string, a number, `undefined`. Do not. Only an `Error` carries a stack
trace, and code that catches it will reasonably assume `error.message` exists.

```javascript
throw 'not found'                  // no stack, no message property
throw new Error('User 7 not found')   // stack, message, name
```

An `Error` has three properties that matter, plus one newer one:

| Property | Holds |
| --- | --- |
| `name` | The kind, `"Error"`, `"TypeError"`, … Used when it prints |
| `message` | What you passed the constructor |
| `stack` | Non-standard but universal: the call stack where the error was *created* |
| `cause` | The error that led to this one, passed as `new Error(msg, { cause })` |

`stack` is captured at `new Error()`, not at `throw`. Build an error in a helper and throw it
elsewhere and the trace points at the helper.

`cause` is how you wrap a low-level failure in a meaningful one without losing the original:

```javascript
try {
  return JSON.parse(text)
} catch (error) {
  throw new Error('Settings file is not valid JSON', { cause: error })
}
```

The built-ins you will see thrown at you: `TypeError` (calling a non-function, reading a property
of `undefined`), `ReferenceError` (an undeclared name, or the dead zone), `RangeError` (a bad
array length, `toFixed(200)`), `SyntaxError` (from `JSON.parse`, or `eval`), and `AggregateError`
from `Promise.any` when every promise rejects.

### catch catches everything

There is one `catch` per `try`, and it takes whatever was thrown. There is no filtering by type,
unlike Java or Python.

```javascript
try {
  const user = await loadUser(id)
  render(usr)                          // a typo
} catch (error) {
  showMessage('Could not load the user')
}
```

That `catch` was written for a network failure and it also swallows the `ReferenceError` from the
typo, so the bug shows up as "could not load the user". Two habits keep this honest:

1. Keep the `try` block to the lines that can fail in the way you are handling.
2. Handle what you recognise, and rethrow the rest.

```javascript
try {
  data = JSON.parse(text)
} catch (error) {
  if (!(error instanceof SyntaxError)) throw error
  data = defaults
}
```

The thing caught is typed `unknown` in TypeScript for a reason. It may not be an `Error` at all if
some library threw a string, so check before reading `.message`.

If you do not need the value, the binding is optional: `catch { … }`.

### finally runs anyway

A `finally` block runs whether the `try` finished, returned, or threw, and whether or not the
`catch` rethrew. It is where cleanup goes: releasing a lock, hiding a spinner, closing a file.

```javascript
function withSpinner(work) {
  spinner.show()
  try {
    return work()
  } finally {
    spinner.hide()   // runs after work() returns or throws
  }
}
```

The `return` value is computed first, then `finally` runs, then the function returns it. Which
leads to the one trap: a `return` or `throw` *inside* `finally` replaces whatever was happening.

```javascript
function lose() {
  try {
    throw new Error('important')
  } finally {
    return 'fine'   // the error is discarded, silently
  }
}
lose()   // "fine"
```

Keep `finally` to cleanup and never return from it.

### Where try stops reaching

`try` covers code that runs synchronously inside it, plus anything you `await` inside it. It does
not cover a callback that runs later.

```javascript
try {
  setTimeout(() => {
    throw new Error('later')    // not caught: try finished long ago
  }, 0)
} catch {
  // never runs
}

try {
  await fetchJson(url)          // caught: await rethrows the rejection here
} catch (error) {
  // runs
}
```

The same goes for a promise you create but do not `await`: its rejection is not thrown into the
surrounding `try`. It surfaces as an unhandled rejection instead, which Node treats as fatal by
default and browsers report on `window`'s `unhandledrejection` event. Promises and the event loop
get their own chapters; the rule for now is that `try` only sees what happens before it exits.

### What throwing costs

Creating an `Error` walks the stack to build `stack`, which is far slower than returning a value.
Once per request, that does not matter. Inside a loop over a hundred thousand rows it can dominate.

So use exceptions for things that should not happen in a correct run: a missing file, a failed
request, a contract broken by the caller. For outcomes that are ordinary, such as "no match",
"invalid input from a form", return a value the caller can check: `null`, a result object, or an
empty array. The next section shows how to make the exceptional ones easy to tell apart.

### What to take away

- Throw `Error` objects, and wrap with `cause` rather than discarding the original.
- `catch` takes everything. Keep `try` small, and rethrow what you do not handle.
- `finally` always runs. Never `return` from it.
- `try` sees synchronous code and awaited promises, not callbacks that run later.
- Exceptions are for the exceptional; expected outcomes are return values.

### The exercise

Three helpers that handle errors the way this section recommends.

1. `withCleanup(work, cleanup)` calls `work()` and returns its result. `cleanup()` runs exactly
   once, after `work`, whether `work` returned or threw. If `work` threw, the same error object
   reaches the caller. Whatever `cleanup` returns is ignored.
2. `toError(thrown)` turns anything caught into an `Error`. An `Error` comes back unchanged. Any
   other value becomes `new Error(String(thrown))`, with the original value kept as its `cause`.
3. `loadSettings(text, validate)` parses `text` as JSON, passes the result to `validate`, and
   returns it. If the text is not valid JSON, throw an `Error` with the message
   `Settings are not valid JSON` and the `SyntaxError` as its `cause`. If `validate` throws, that
   error is not a JSON problem: let it reach the caller unchanged.

## file errors.js

```javascript
// 1. Returns work()'s result. cleanup() always runs once, afterwards.
export function withCleanup(work, cleanup) {
  const result = work()
  cleanup()
  return result
}

// 2. An Error, unchanged, or a new Error with the thrown value as its cause.
export function toError(thrown) {
  return thrown
}

// 3. Parse, validate, return. Wrap JSON errors; let validate's errors through.
export function loadSettings(text, validate) {
  try {
    const settings = JSON.parse(text)
    validate(settings)
    return settings
  } catch (error) {
    throw new Error('Settings are not valid JSON')
  }
}
```

## solution

```javascript
export function withCleanup(work, cleanup) {
  try {
    return work()
  } finally {
    cleanup()
  }
}

export function toError(thrown) {
  if (thrown instanceof Error) return thrown
  return new Error(String(thrown), { cause: thrown })
}

export function loadSettings(text, validate) {
  let settings
  try {
    settings = JSON.parse(text)
  } catch (error) {
    throw new Error('Settings are not valid JSON', { cause: error })
  }
  validate(settings)
  return settings
}
```

## explanation

`withCleanup` is `try` and `finally` with no `catch`. The `finally` runs after `work()` has
returned or thrown, and because it does not `return`, the function's outcome is whatever `work`
did: its return value, or its error, still the same object. Writing `return cleanup()` in the
`finally` would replace both, and a `catch` that rethrows `new Error(error.message)` would lose the
original's type and stack.

`toError` exists because `catch` takes anything, and some library somewhere throws a string.
Returning an existing `Error` unchanged keeps its stack and its subclass. Everything else is
wrapped, and `cause` keeps the original value, so nothing is lost in the conversion.

`loadSettings` keeps the `try` to the one line that can fail the way it is handling. The starter's
`try` also covered `validate`, so a validation error came out labelled as a JSON error, with the
real message thrown away. Moving `validate` out of the `try` lets its errors pass untouched, and
`cause` keeps the `SyntaxError` behind the friendlier message.

## check withCleanup returns the work's result and cleans up afterwards

cleanup runs once, after work.

```javascript
const log = []
const result = withCleanup(
  () => {
    log.push('work')
    return 42
  },
  () => {
    log.push('cleanup')
  },
)
assert.strictEqual(result, 42)
assert.deepStrictEqual(log, ['work', 'cleanup'])
```

## check withCleanup cleans up when the work throws, and rethrows the same error

The caller gets the original error object, not a copy.

```javascript
const failure = new TypeError('boom')
let cleaned = 0
let caught
try {
  withCleanup(
    () => {
      throw failure
    },
    () => {
      cleaned++
    },
  )
} catch (error) {
  caught = error
}
assert.strictEqual(cleaned, 1)
assert.strictEqual(caught, failure)
```

## check withCleanup ignores what cleanup returns

A return in finally would replace the result, or swallow the error.

```javascript
assert.strictEqual(
  withCleanup(
    () => 'work',
    () => 'cleanup',
  ),
  'work',
)
assert.throws(() =>
  withCleanup(
    () => {
      throw new Error('kept')
    },
    () => 'cleanup',
  ),
)
```

## check toError returns an Error unchanged

Same object, so its stack and subclass survive.

```javascript
const original = new RangeError('too big')
assert.strictEqual(toError(original), original)
```

## check toError wraps a thrown string and keeps it

The message is the string, and so is the cause.

```javascript
const error = toError('not found')
assert.ok(error instanceof Error, 'not an Error')
assert.strictEqual(error.message, 'not found')
assert.strictEqual(error.cause, 'not found')
```

## check toError wraps any other value as the cause

Numbers, undefined and plain objects all become Errors.

```javascript
const detail = { code: 'E42' }
assert.strictEqual(toError(detail).cause, detail)
assert.ok(toError(detail) instanceof Error)
assert.strictEqual(toError(404).message, '404')
assert.ok(toError(undefined) instanceof Error)
assert.ok('cause' in toError(undefined), 'undefined was not kept as the cause')
```

## check loadSettings parses and validates

validate sees the parsed object, and the same object comes back.

```javascript
let seen
const settings = loadSettings('{"theme":"dark"}', value => {
  seen = value
})
assert.deepStrictEqual(settings, { theme: 'dark' })
assert.strictEqual(seen, settings)
```

## check loadSettings wraps invalid JSON with its cause

A friendlier message, with the SyntaxError kept underneath.

```javascript
let caught
try {
  loadSettings('{theme: dark}', () => {})
} catch (error) {
  caught = error
}
assert.ok(caught instanceof Error, 'nothing was thrown')
assert.strictEqual(caught.message, 'Settings are not valid JSON')
assert.ok(caught.cause instanceof SyntaxError, 'the cause is not the SyntaxError')
```

## check loadSettings lets a validation error through unchanged

That error is not about JSON, so it must not be relabelled.

```javascript
const invalid = new RangeError('fontSize must be under 72')
let caught
try {
  loadSettings('{"fontSize":200}', () => {
    throw invalid
  })
} catch (error) {
  caught = error
}
assert.strictEqual(caught, invalid)
```

## hint after 1

`try { return work() } finally { cleanup() }`. No `catch` is needed, and no `return` in the
`finally`.

## hint after 2

`new Error(String(thrown), { cause: thrown })`, unless `thrown instanceof Error` already.

## hint after 3

In `loadSettings`, put only `JSON.parse` inside the `try`. Declare `settings` with `let` above it
so the rest of the function can use it.
