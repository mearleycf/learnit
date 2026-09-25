---
type: exercise
title: "Memoization Patterns"
description: "Advanced memoization techniques in React"
entry: "memo.js"
minutes: 25
difficulty: hard
files:
  - name: "memo.js"
    language: javascript
---

Write the three pieces that sit under React's memoisation.

No React import here. `React.memo` is a shallow prop comparison and `useMemo` is a cache keyed
on a dependency array, and both are plain JavaScript once you take the hook away.

In **memo.js**, export three functions.

1. `shallowEqual(a, b)` is true when two objects have the same keys and each value is equal by
   `Object.is`. This is what `React.memo` does. `Object.is` matters: `NaN` equals itself and
   `+0` does not equal `-0`.
2. `memoizeOne(fn)` returns a wrapped function remembering **only the most recent** call. Called
   again with arguments equal by `Object.is`, it returns the cached result without calling
   `fn`. Different arguments replace the cache. This is the shape `useMemo` has.
3. `memoize(fn, keyFor)` returns a wrapped function caching **every** result, keyed by
   `keyFor(...args)`. When `keyFor` is omitted, use the first argument as the key. Give the
   wrapped function a `.cache` Map so a caller can inspect or clear it.

A cached call must not invoke `fn` again, which several of the checks verify by counting calls.

## file memo.js

```javascript
// 1. Same keys, each value equal by Object.is. What React.memo does.
export function shallowEqual(a, b) {}

// 2. Remember only the most recent call. The shape useMemo has.
export function memoizeOne(fn) {}

// 3. Cache every result, keyed by keyFor(...args) or the first argument.
// Expose the Map as .cache on the returned function.
export function memoize(fn, keyFor) {}
```

## solution

```javascript
export function shallowEqual(a, b) {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) return false
  return aKeys.every(key => Object.hasOwn(b, key) && Object.is(a[key], b[key]))
}

export function memoizeOne(fn) {
  let lastArgs = null
  let lastResult

  return (...args) => {
    const same =
      lastArgs !== null &&
      lastArgs.length === args.length &&
      lastArgs.every((arg, index) => Object.is(arg, args[index]))

    if (same) return lastResult

    lastArgs = args
    lastResult = fn(...args)
    return lastResult
  }
}

export function memoize(fn, keyFor) {
  const cache = new Map()

  const wrapped = (...args) => {
    const key = keyFor ? keyFor(...args) : args[0]
    // has() not a truthiness check, so a cached 0 or undefined still counts.
    if (cache.has(key)) return cache.get(key)

    const result = fn(...args)
    cache.set(key, result)
    return result
  }

  wrapped.cache = cache
  return wrapped
}
```

## explanation

shallowEqual compares key counts first, which rejects most mismatches immediately, then checks each value with Object.is. The hasOwn guard stops a key inherited from a prototype counting as present. memoizeOne holds one previous argument list and compares it element by element, so a different arity is caught by the length check before any element is read. memoize uses cache.has rather than testing the value, which is what makes a cached 0 or undefined behave correctly, and attaching the Map itself to .cache means a caller clearing it really does empty the cache.

## check shallowEqual accepts objects with equal values

Same keys and same values, compared one level deep.

```javascript
assert.strictEqual(shallowEqual({a:1,b:'x'}, {a:1,b:'x'}), true)
```

## check shallowEqual rejects a differing value

One value out of step is enough.

```javascript
assert.strictEqual(shallowEqual({a:1}, {a:2}), false)
```

## check shallowEqual rejects a different set of keys

An extra key on either side means not equal.

```javascript
assert.strictEqual(shallowEqual({a:1}, {a:1,b:2}), false); assert.strictEqual(shallowEqual({a:1,b:2}, {a:1}), false)
```

## check shallowEqual does not look inside nested objects

Shallow means shallow: two equal-looking nested objects are different references.

```javascript
assert.strictEqual(shallowEqual({a:{n:1}}, {a:{n:1}}), false)
```

## check shallowEqual follows Object.is on NaN and signed zero

NaN equals itself; +0 does not equal -0. This is why Object.is, not ===.

```javascript
assert.strictEqual(shallowEqual({a:NaN}, {a:NaN}), true); assert.strictEqual(shallowEqual({a:0}, {a:-0}), false)
```

## check memoizeOne returns the cached result for the same arguments

The wrapped function must not run a second time.

```javascript
let calls = 0; const f = memoizeOne((a, b) => { calls += 1; return a + b }); assert.strictEqual(f(1, 2), 3); assert.strictEqual(f(1, 2), 3); assert.strictEqual(calls, 1)
```

## check memoizeOne recomputes when an argument changes

Different arguments mean a real call.

```javascript
let calls = 0; const f = memoizeOne((a) => { calls += 1; return a * 2 }); f(1); f(2); assert.strictEqual(calls, 2)
```

## check memoizeOne only remembers the most recent call

Going back to an earlier argument recomputes; there is one slot.

```javascript
let calls = 0; const f = memoizeOne((a) => { calls += 1; return a }); f(1); f(2); f(1); assert.strictEqual(calls, 3)
```

## check memoizeOne notices a different number of arguments

Calling with fewer or more arguments is a different call.

```javascript
let calls = 0; const f = memoizeOne((...args) => { calls += 1; return args.length }); f(1); f(1, 2); assert.strictEqual(calls, 2)
```

## check memoize caches every distinct key

Unlike memoizeOne, earlier results survive.

```javascript
let calls = 0; const f = memoize((n) => { calls += 1; return n * 2 }); f(1); f(2); f(1); assert.strictEqual(calls, 2)
```

## check memoize uses keyFor when given one

Two calls producing the same key share a result.

```javascript
let calls = 0; const f = memoize((user) => { calls += 1; return user.name }, (user) => user.id); f({id:1,name:'a'}); f({id:1,name:'b'}); assert.strictEqual(calls, 1)
```

## check memoize exposes its cache

A Map on .cache, so a caller can inspect or clear it.

```javascript
const f = memoize((n) => n * 2); f(3); assert.ok(f.cache instanceof Map); assert.strictEqual(f.cache.get(3), 6)
```

## check clearing the cache makes the next call recompute

The exposed Map is the real one, not a copy.

```javascript
let calls = 0; const f = memoize((n) => { calls += 1; return n }); f(1); f.cache.clear(); f(1); assert.strictEqual(calls, 2)
```

## check memoize caches a falsy result

A result of 0 or undefined is still a cached result.

```javascript
let calls = 0; const f = memoize(() => { calls += 1; return 0 }); f('k'); f('k'); assert.strictEqual(calls, 1)
```

## hint after 1

```javascript
Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(k => Object.is(a[k], b[k]))
```

## hint after 2

memoizeOne needs to remember the previous arguments array as well as the result, and compare it element by element.

## hint after 3

For the falsy-result test, check cache.has(key) rather than whether the cached value is truthy.

## hint after 4

```javascript
const wrapped = (...args) => { /* ... */ }
wrapped.cache = cache
return wrapped
```
