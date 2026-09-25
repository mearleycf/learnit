---
type: lesson
title: "Function Basics"
description: "Introduction to Python functions"
access: free
references:
  - "https://docs.python.org/3/tutorial/controlflow.html#defining-functions"
  - "https://docs.python.org/3/faq/programming.html#why-are-default-values-shared-between-objects"
---

Functions look familiar and differ in three ways that matter.

## The basic shape

```python
def estimate(minutes, per_day=30):
    """Days needed to finish, rounding up."""
    return -(-minutes // per_day)
```

`def`, a docstring by convention, and a default argument that looks like JavaScript's.

There is no arrow function. `lambda` exists and is deliberately crippled to a single
expression:

```python
by_length = sorted(titles, key=lambda t: len(t))
```

That is essentially all `lambda` is for: a one-expression callback passed to something else. If
it needs two lines, write a `def`. Python's authors made this awkward on purpose.

## Keyword arguments, which you will end up loving

Any parameter can be passed by name.

```python
def split(text, separator=",", limit=None):
    ...

split("a,b,c", limit=2)                # skip separator entirely
split(text="a,b", separator=";")       # name everything
```

This removes the options-object pattern. In JavaScript you write
`split(text, { limit: 2 })` to avoid a positional boolean; in Python the language does it.

You can force the issue:

```python
def connect(host, *, timeout=30, retries=3):
    ...

connect("localhost", timeout=5)   # fine
connect("localhost", 5)           # TypeError
```

Everything after `*` must be passed by name. Worth doing for any parameter whose meaning is not
obvious at the call site, which is most booleans.

## The mutable default argument

This is the one genuine trap in Python function definitions, and everyone hits it once.

```python
def add(item, items=[]):     # wrong
    items.append(item)
    return items

add("a")    # ["a"]
add("b")    # ["a", "b"]   — the same list, still there
```

The default is evaluated **once, when the function is defined**, not on each call. A mutable
default is therefore shared by every call that does not supply one.

The fix is always the same:

```python
def add(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

Linters catch this. Know why it happens anyway, because the same evaluation-once rule explains
other surprises.

## Returning several things

```python
def stats(numbers):
    return min(numbers), max(numbers), sum(numbers) / len(numbers)

low, high, mean = stats([1, 2, 3])
```

That is a tuple and then unpacking. It replaces JavaScript's "return an object and destructure",
with the caveat that position matters, so three values is about the limit before you should
return something named.

## Arguments and their names

```python
def log(message, *args, **kwargs):
    ...
```

`*args` is a tuple of extra positional arguments, the rest parameter you know. `**kwargs` is a
dictionary of extra keyword arguments, which JavaScript has no equivalent for.

At a call site the same symbols spread:

```python
log("hi", *values, **options)
```

## Scope

Python has no `let` or `const`. Assignment creates a local name, and reading a name that only
exists outside is fine, but assigning to it is not:

```python
count = 0

def increment():
    count += 1      # UnboundLocalError
```

The assignment makes `count` local to `increment`, so the read on the right happens before it
has a value. Say `global count`, or better, return the new value and let the caller assign it.

Closures work as you expect, and the late-binding gotcha in a loop is the same one JavaScript
had before `let`.
