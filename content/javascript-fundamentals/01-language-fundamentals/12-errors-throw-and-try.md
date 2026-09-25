---
type: lesson
title: "Errors, throw and try"
description: "What throwing costs, what catch actually catches, and why finally runs anyway"
---

`throw` stops the current function and unwinds the call stack until something catches. Nothing
about that is unusual. What is worth knowing is what JavaScript lets you throw, how
indiscriminate `catch` is, and where `try` stops reaching.

## Throw Error objects

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

## catch catches everything

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

## finally runs anyway

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

## Where try stops reaching

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

## What throwing costs

Creating an `Error` walks the stack to build `stack`, which is far slower than returning a value.
Once per request, that does not matter. Inside a loop over a hundred thousand rows it can dominate.

So use exceptions for things that should not happen in a correct run: a missing file, a failed
request, a contract broken by the caller. For outcomes that are ordinary, such as "no match",
"invalid input from a form", return a value the caller can check: `null`, a result object, or an
empty array. The next section shows how to make the exceptional ones easy to tell apart.

## What to take away

- Throw `Error` objects, and wrap with `cause` rather than discarding the original.
- `catch` takes everything. Keep `try` small, and rethrow what you do not handle.
- `finally` always runs. Never `return` from it.
- `try` sees synchronous code and awaited promises, not callbacks that run later.
- Exceptions are for the exceptional; expected outcomes are return values.
