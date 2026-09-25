---
type: exercise
title: "Advanced Function Practice"
description: "Practice with advanced function concepts"
access: free
entry: "advanced.py"
minutes: 25
difficulty: hard
files:
  - name: "advanced.py"
    language: python
---

Decorators and generators, the two pieces of Python with no everyday JavaScript equivalent.

In **advanced.py**:

1. `counted(fn)` is a decorator returning a wrapper that forwards everything and exposes a
   `.calls` count of how many times it ran. Use `functools.wraps` so the wrapper keeps the
   original's `__name__`.
2. `memoized(fn)` caches by the positional arguments. A repeat call must not run `fn` again.
   Expose the cache dict as `.cache`.
3. `take(iterable, n)` is a generator yielding at most the first `n` items. It must not
   consume more of the iterable than it needs.
4. `chunks(items, size)` yields lists of `size` items, the last possibly shorter.

## file advanced.py

```python
import functools


# 1. Decorator exposing .calls. Keep the original __name__ with functools.wraps.
def counted(fn):
    return fn


# 2. Cache by positional arguments. Expose the dict as .cache.
def memoized(fn):
    return fn


# 3. Generator yielding at most the first n items, consuming no more than needed.
def take(iterable, n):
    return iter(())


# 4. Yield lists of size items; the last may be shorter.
def chunks(items, size):
    return iter(())
```

## solution

```python
import functools


def counted(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return fn(*args, **kwargs)

    wrapper.calls = 0
    return wrapper


def memoized(fn):
    cache = {}

    @functools.wraps(fn)
    def wrapper(*args):
        if args not in cache:
            cache[args] = fn(*args)
        return cache[args]

    wrapper.cache = cache
    return wrapper


def take(iterable, n):
    for index, item in enumerate(iterable):
        if index >= n:
            return
        yield item


def chunks(items, size):
    for start in range(0, len(items), size):
        yield items[start:start + size]
```

## explanation

The counter lives on the wrapper rather than in a closure variable, which is what makes .calls readable from outside. functools.wraps copies __name__ and the docstring across, without which every traceback says "wrapper". The args tuple is hashable, so it works as a dict key directly, and `not in` rather than a truthiness test means a cached 0 is still a hit. take returns rather than breaking, which ends the generator; because it is a generator, nothing is pulled from the iterable until asked for, which is what lets it work on an infinite one.

## check counted forwards arguments and the result

The wrapper behaves exactly like the function it wraps.

```python
@counted
def add(a, b):
    return a + b
assert add(1, 2) == 3
```

## check counted tracks how many times it ran

A .calls attribute on the wrapper.

```python
@counted
def noop():
    pass
noop()
noop()
assert noop.calls == 2
```

## check counted keeps the original name

Without functools.wraps this reports "wrapper".

```python
@counted
def greet():
    pass
assert greet.__name__ == "greet"
```

## check memoized returns the cached result

A second call with the same arguments must not run the function.

```python
runs = []
@memoized
def slow(n):
    runs.append(n)
    return n * 2
assert slow(2) == 4
assert slow(2) == 4
assert len(runs) == 1
```

## check memoized recomputes for different arguments

A new key means a real call.

```python
runs = []
@memoized
def f(n):
    runs.append(n)
    return n
f(1)
f(2)
assert len(runs) == 2
```

## check memoized exposes its cache

A dict on .cache, keyed by the positional arguments.

```python
@memoized
def double(n):
    return n * 2
double(3)
assert double.cache[(3,)] == 6
```

## check take yields at most n items

Three from a longer sequence.

```python
assert list(take([1, 2, 3, 4, 5], 3)) == [1, 2, 3]
```

## check take stops early when the iterable is shorter

Asking for more than there is gives everything.

```python
assert list(take([1, 2], 5)) == [1, 2]
```

## check take does not consume more than it needs

From an infinite generator, taking three must terminate.

```python
def forever():
    n = 0
    while True:
        yield n
        n += 1
assert list(take(forever(), 3)) == [0, 1, 2]
```

## check chunks splits into equal lists

Six items in twos gives three lists.

```python
assert list(chunks([1, 2, 3, 4, 5, 6], 2)) == [[1, 2], [3, 4], [5, 6]]
```

## check chunks leaves a short final list

Five items in twos ends with a single.

```python
assert list(chunks([1, 2, 3, 4, 5], 2)) == [[1, 2], [3, 4], [5]]
```

## hint after 1

```python
@functools.wraps(fn)
def wrapper(*args, **kwargs):
    wrapper.calls += 1
    return fn(*args, **kwargs)
wrapper.calls = 0
return wrapper
```

## hint after 2

Key the cache on the args tuple. Check membership with `in`, not truthiness, so a cached 0 still counts.

## hint after 3

A function containing yield is already a generator. Loop and break once you have yielded n.

## hint after 4

```python
for start in range(0, len(items), size):
    yield items[start:start + size]
```
