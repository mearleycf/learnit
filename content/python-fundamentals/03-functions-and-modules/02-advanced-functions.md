---
type: lesson
title: "Advanced Functions"
description: "Understanding advanced function concepts"
access: free
references:
  - "https://docs.python.org/3/glossary.html#term-decorator"
  - "https://docs.python.org/3/library/functools.html"
  - "https://docs.python.org/3/tutorial/classes.html#generators"
---

Decorators, generators and the parts of the standard library you would otherwise reinvent.

## Decorators

A decorator is a function that takes a function and returns a replacement.

```python
def logged(fn):
    def wrapper(*args, **kwargs):
        print(f"calling {fn.__name__}")
        return fn(*args, **kwargs)
    return wrapper


@logged
def seed_database():
    ...
```

`@logged` above a definition means exactly `seed_database = logged(seed_database)`. That is the
whole feature. Everything else is convention.

The `*args, **kwargs` in the wrapper is what lets it wrap any function without knowing its
signature.

One thing worth doing properly:

```python
import functools

def logged(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper
```

Without `functools.wraps`, the wrapper replaces the original's name and docstring, and every
debugging session afterwards shows `wrapper` instead of the real function.

You will meet decorators constantly in frameworks: `@property`, `@staticmethod`,
`@app.route(...)`, `@pytest.fixture`.

## Caching, for free

```python
@functools.cache
def fibonacci(n):
    return n if n < 2 else fibonacci(n - 1) + fibonacci(n - 2)
```

That is the memoize you wrote by hand in the React course, in the standard library, one line.
`functools.lru_cache(maxsize=1000)` when unbounded growth would be a problem.

## Generators

A function with `yield` returns a generator: values produced one at a time, on demand.

```python
def lines_of(path):
    with open(path) as file:
        for line in file:
            yield line.rstrip()
```

Nothing runs until you iterate, and only one line is in memory at a time. The equivalent
JavaScript is `function*`, which you have probably never reached for; in Python it is everyday.

```python
squares = (n * n for n in range(1_000_000))   # a generator, not a list
```

Parentheses instead of brackets makes a comprehension lazy. The list version would allocate a
million integers; this one allocates almost nothing.

## with, which is try/finally worth using

```python
with open("data.json") as file:
    contents = file.read()
# closed here, even if read() raised
```

JavaScript has no equivalent, which is why every file example there has a `finally` block or a
leak. Anything holding a resource supports this: files, locks, database connections, temporary
directories.

## Unpacking in calls and definitions

```python
def render(title, minutes, done=False):
    ...

lesson = {"title": "Arrays", "minutes": 40}
render(**lesson)          # keys become keyword arguments
```

This is the closest thing to passing an options object, and it type-checks at the call rather
than inside the function.

## Type hints

Optional, unenforced at runtime, and increasingly expected:

```python
def estimate(minutes: int, per_day: int = 30) -> int:
    return -(-minutes // per_day)
```

Nothing checks these when the program runs. `mypy` or `pyright` checks them the way `tsc`
checks TypeScript, and the mental model is close enough that you will be at home immediately.
The difference is that Python runs regardless, so hints are documentation with a tool attached
rather than a gate.
