---
type: exercise
title: "References and Copying"
description: "Tell a copy from an alias, and copy deeply without reaching for a library"
entry: copying.js
minutes: 25
difficulty: medium
files:
  - name: copying.js
    language: javascript
---

Assigning an object copies the reference, not the object. `const b = a` gives you two names for
one thing, and a spread copies only the top level: nested objects and arrays are still shared.

None of these functions may change their arguments.

1. `rename(user, name)` returns a new user with `name` replaced. The original keeps its name.
2. `addTag(post, tag)` returns a new post with `tag` appended to `post.tags`. The original's
   `tags` array must be untouched, which a spread alone does not give you.
3. `deepCopy(value)` copies plain objects, arrays and `Date`s at every depth. Primitives and
   functions come back as they are. An object that contains itself, directly or further down,
   must not loop forever: the copy should contain itself in the same place.

`structuredClone` exists and is usually the right tool, but it throws on a function, so it cannot
do part 3. Write the recursion yourself.

## file copying.js

```javascript
// 1. A new user with name replaced. Do not change the one passed in.
export function rename(user, name) {
  user.name = name
  return user
}

// 2. A new post with tag on the end of tags. The original tags array stays as it was.
export function addTag(post, tag) {
  const copy = { ...post }
  copy.tags.push(tag)
  return copy
}

// 3. Plain objects, arrays and Dates copied at every depth. Survives an object containing itself.
export function deepCopy(value) {
  return { ...value }
}
```

## solution

```javascript
export function rename(user, name) {
  return { ...user, name }
}

export function addTag(post, tag) {
  return { ...post, tags: [...post.tags, tag] }
}

export function deepCopy(value, seen = new WeakMap()) {
  if (typeof value !== 'object' || value === null) return value
  if (seen.has(value)) return seen.get(value)
  if (value instanceof Date) return new Date(value.getTime())

  const copy = Array.isArray(value) ? [] : {}
  seen.set(value, copy)
  for (const key of Object.keys(value)) {
    copy[key] = deepCopy(value[key], seen)
  }
  return copy
}
```

## explanation

`rename` spreads the user into a new object and overrides one key. The starter's version mutates
and returns the same object, so every other holder of that reference sees the name change too.

`addTag` shows where a spread stops. `{ ...post }` is a new object whose `tags` property points at
the *same* array, so `push` reaches straight through to the original. Copying the array as well,
`[...post.tags, tag]`, is the fix, and it is the pattern behind every immutable update in React
and Redux: copy each level you change, share the rest.

`deepCopy` recurses on every own key. A `Date` keeps its value in an internal slot rather than in
properties, so a key-by-key copy of one is an empty object; it needs its own branch. Functions
fall through the first line with the primitives and are returned as the same function.

The `WeakMap` handles cycles. It records each original against its copy *before* recursing into
its children, so when the walk meets the same object again it returns the copy already under
construction instead of starting another. A `WeakMap` rather than a `Map` means the bookkeeping
never keeps an object alive on its own.

This version turns class instances into plain objects, since it builds `{}` rather than using the
original's prototype. `structuredClone` does the same, which is one more reason to keep data you
intend to copy as plain data.

## check rename returns a user with the new name

The returned object has the change.

```javascript
const renamed = rename({ id: 1, name: 'Ada' }, 'Grace')
assert.deepStrictEqual(renamed, { id: 1, name: 'Grace' })
```

## check rename leaves the original alone

A copy, not an alias.

```javascript
const user = { id: 1, name: 'Ada' }
const renamed = rename(user, 'Grace')
assert.strictEqual(user.name, 'Ada')
assert.notStrictEqual(renamed, user)
```

## check addTag appends the tag

The new post carries every tag, in order.

```javascript
const post = { title: 'Closures', tags: ['js'] }
assert.deepStrictEqual(addTag(post, 'scope').tags, ['js', 'scope'])
```

## check addTag does not reach into the original array

This is the one a bare spread gets wrong.

```javascript
const post = { title: 'Closures', tags: ['js'] }
addTag(post, 'scope')
assert.deepStrictEqual(post.tags, ['js'])
```

## check deepCopy copies nested objects and arrays

Equal in shape, separate in memory, at every level.

```javascript
const original = { a: { b: { c: 1 } }, list: [{ id: 1 }] }
const copy = deepCopy(original)
copy.a.b.c = 2
copy.list[0].id = 2
assert.strictEqual(original.a.b.c, 1)
assert.strictEqual(original.list[0].id, 1)
assert.ok(Array.isArray(copy.list), 'an array should stay an array')
```

## check deepCopy copies a Date as a Date

Same moment, different object.

```javascript
const when = new Date('2026-01-01T00:00:00Z')
const copy = deepCopy({ when })
assert.ok(copy.when instanceof Date, 'expected a Date')
assert.strictEqual(copy.when.getTime(), when.getTime())
assert.notStrictEqual(copy.when, when)
```

## check deepCopy returns primitives and functions unchanged

Nothing to copy.

```javascript
const fn = () => 1
assert.strictEqual(deepCopy(5), 5)
assert.strictEqual(deepCopy(null), null)
assert.strictEqual(deepCopy({ fn }).fn, fn)
```

## check deepCopy survives an object that contains itself

The copy points at itself, not at the original.

```javascript
const node = { name: 'root', children: [] }
node.children.push(node)
const copy = deepCopy(node)
assert.strictEqual(copy.children[0], copy)
assert.notStrictEqual(copy, node)
```

## hint after 1

```javascript
return { ...post, tags: [...post.tags, tag] }
```

## hint after 2

Return early for anything that is not an object, then branch on `Date` and `Array.isArray` before
building the copy.

## hint after 3

Pass a `WeakMap` down the recursion. Store each copy in it *before* copying the children, and check
it at the top of each call.
