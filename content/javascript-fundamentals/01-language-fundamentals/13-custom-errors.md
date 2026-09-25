---
type: exercise
title: "Custom Errors"
description: "Subclass Error so a caller can branch on the failure instead of parsing a message"
entry: errors.js
minutes: 25
difficulty: medium
files:
  - name: errors.js
    language: javascript
---

A caller that has to read `error.message` to decide what happened is one reworded message away
from breaking. Give each failure its own class and the caller can branch with `instanceof`, and
read structured fields instead of parsing text.

1. `ValidationError` extends `Error`. `new ValidationError(field, message)` sets `message`, a
   `field` property, and a `name` of `"ValidationError"`.
2. `NotFoundError` extends `Error`. `new NotFoundError(resource, id, options)` builds the message
   `"<resource> <id> not found"`, stores `resource` and `id`, sets `name` to `"NotFoundError"`,
   and passes `options` on to `Error` so a `cause` survives.
3. `parseQuantity(input)` turns a string into a whole number of at least 1. Anything else throws a
   `ValidationError` for the field `"quantity"`.
4. `describeFailure(fn)` calls `fn`. If it throws a `ValidationError`, return
   `"Check the <field> field"`. If it throws a `NotFoundError`, return `"<resource> not found"`.
   Anything else is not yours to handle: rethrow it. If `fn` does not throw, return `"OK"`.

## file errors.js

```javascript
// 1. field and message, name "ValidationError".
export class ValidationError extends Error {}

// 2. "<resource> <id> not found", with resource, id and a cause passed through options.
export class NotFoundError extends Error {}

// 3. A whole number of at least 1, or throw a ValidationError for "quantity".
export function parseQuantity(input) {
  return Number(input)
}

// 4. Branch on the error's class. Rethrow anything you do not recognise.
export function describeFailure(fn) {
  try {
    fn()
    return 'OK'
  } catch (error) {
    return error.message
  }
}
```

## solution

```javascript
export class ValidationError extends Error {
  constructor(field, message) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}

export class NotFoundError extends Error {
  constructor(resource, id, options) {
    super(`${resource} ${id} not found`, options)
    this.name = 'NotFoundError'
    this.resource = resource
    this.id = id
  }
}

export function parseQuantity(input) {
  const quantity = Number(input)
  if (typeof input !== 'string' || input.trim() === '' || !Number.isInteger(quantity) || quantity < 1) {
    throw new ValidationError('quantity', `Expected a whole number of at least 1, got "${input}"`)
  }
  return quantity
}

export function describeFailure(fn) {
  try {
    fn()
    return 'OK'
  } catch (error) {
    if (error instanceof ValidationError) return `Check the ${error.field} field`
    if (error instanceof NotFoundError) return `${error.resource} not found`
    throw error
  }
}
```

## explanation

Each constructor calls `super` first, because `this` does not exist in a subclass constructor
until it has. `super(message)` sets `message` and captures the stack; everything after it is
yours.

`name` is set explicitly. It is what prints in the console and in a stack trace, and the inherited
value is `"Error"`. You will see `this.name = this.constructor.name` in the wild, and it works until
a minifier renames the class to `t`.

`NotFoundError` passes `options` straight to `Error`, which is where `cause` is handled. That lets
a repository wrap a database error in a `NotFoundError` without the original disappearing.

`parseQuantity` guards the empty string for the reason covered in the coercion section:
`Number('')` is `0`, and `Number('  ')` is too. `Number.isInteger` rejects `NaN`, `Infinity` and
`2.5` in one call.

`describeFailure` is the point of the exercise. It checks the classes it knows and rethrows
everything else. The starter's version returns any message it finds, so a `TypeError` from a bug
would reach the user as a sentence about reading properties of undefined.

`instanceof` works across the class hierarchy, so a `class MissingUserError extends NotFoundError`
would still be handled as not found. That is the other advantage over comparing `name` strings.

## check ValidationError is an Error with a field

Branchable by class, and still an Error.

```javascript
const error = new ValidationError('email', 'Email is required')
assert.ok(error instanceof ValidationError, 'expected instanceof ValidationError')
assert.ok(error instanceof Error, 'expected instanceof Error')
assert.strictEqual(error.field, 'email')
assert.strictEqual(error.message, 'Email is required')
```

## check ValidationError names itself

The name is what shows in a stack trace.

```javascript
assert.strictEqual(new ValidationError('email', 'x').name, 'ValidationError')
```

## check NotFoundError builds its message and keeps its fields

Structured data, so no one has to parse the message.

```javascript
const error = new NotFoundError('User', 7)
assert.strictEqual(error.message, 'User 7 not found')
assert.strictEqual(error.name, 'NotFoundError')
assert.strictEqual(error.resource, 'User')
assert.strictEqual(error.id, 7)
```

## check NotFoundError keeps the cause

The original failure survives the wrapping.

```javascript
const original = new Error('connection reset')
const error = new NotFoundError('User', 7, { cause: original })
assert.strictEqual(error.cause, original)
```

## check parseQuantity accepts a whole number

A clean numeric string becomes a number.

```javascript
assert.strictEqual(parseQuantity('3'), 3)
```

## check parseQuantity rejects bad input with a ValidationError

Empty, fractional, zero and text all fail, naming the field.

```javascript
for (const input of ['', '2.5', '0', 'lots']) {
  let caught = null
  try {
    parseQuantity(input)
  } catch (error) {
    caught = error
  }
  assert.ok(caught instanceof ValidationError, `expected a ValidationError for "${input}"`)
  assert.strictEqual(caught.field, 'quantity')
}
```

## check describeFailure branches on the error class

Each known failure gets its own message.

```javascript
assert.strictEqual(describeFailure(() => parseQuantity('')), 'Check the quantity field')
assert.strictEqual(
  describeFailure(() => {
    throw new NotFoundError('Order', 12)
  }),
  'Order not found',
)
assert.strictEqual(describeFailure(() => 1), 'OK')
```

## check describeFailure rethrows what it does not recognise

A bug is not a validation problem.

```javascript
assert.throws(() =>
  describeFailure(() => {
    null.length
  }),
)
```

## hint after 1

```javascript
constructor(field, message) {
  super(message)
  this.name = 'ValidationError'
  this.field = field
}
```

## hint after 2

`Error` takes a second argument, `{ cause }`. Pass `options` to `super` as it is.

## hint after 3

In `describeFailure`, test `error instanceof ValidationError` and `error instanceof NotFoundError`,
and end the `catch` with `throw error`.
