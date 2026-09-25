---
type: exercise
title: "Basic Function Practice"
description: "Practice writing Python functions"
access: free
entry: "functions.py"
minutes: 20
difficulty: medium
files:
  - name: "functions.py"
    language: python
---

Default arguments, keyword-only parameters, and the shared-mutable-default trap.

In **functions.py**:

1. `add_tag(tag, tags=None)` appends `tag` and returns the list. Calling it twice with no
   `tags` must give `["a"]` then `["b"]`, not `["a", "b"]`. This is the mutable default trap
   from the lesson.
2. `format_row(title, *, minutes=0, done=False)` returns `"Arrays (40 min) [done]"`, dropping
   the bracket when not done. `minutes` and `done` must be keyword-only.
3. `summarise(**fields)` turns keyword arguments into `"key=value"` pairs joined by `", "`,
   sorted by key.
4. `apply_all(value, *functions)` passes `value` through each function in turn and returns
   the result. No functions returns the value unchanged.

## file functions.py

```python
# 1. Append and return. Must not share a list between calls.
def add_tag(tag, tags=None):
    return []


# 2. "Arrays (40 min) [done]". minutes and done are keyword-only.
def format_row(title):
    return ""


# 3. Keyword arguments as "key=value", joined by ", ", sorted by key.
def summarise(**fields):
    return ""


# 4. Pass value through each function in turn.
def apply_all(value, *functions):
    return value
```

## solution

```python
def add_tag(tag, tags=None):
    if tags is None:
        tags = []
    tags.append(tag)
    return tags


def format_row(title, *, minutes=0, done=False):
    row = f"{title} ({minutes} min)"
    return f"{row} [done]" if done else row


def summarise(**fields):
    return ", ".join(f"{key}={value}" for key, value in sorted(fields.items()))


def apply_all(value, *functions):
    for function in functions:
        value = function(value)
    return value
```

## explanation

The None default is the whole fix for the shared-list trap: the new list is built on each call rather than once at definition. The bare * in format_row forces everything after it to be passed by name, which is what makes the positional call raise. sorted() on dict.items() sorts by key, since tuples compare element by element. apply_all is a plain loop, which reads better here than functools.reduce would.

## check add_tag appends to a supplied list

The given list comes back with the tag on the end.

```python
assert add_tag("b", ["a"]) == ["a", "b"]
```

## check add_tag does not share a list between calls

The mutable default trap. Two bare calls must not accumulate.

```python
assert add_tag("a") == ["a"]
assert add_tag("b") == ["b"]
```

## check format_row builds the row

Title, minutes in parentheses, and the done marker.

```python
assert format_row("Arrays", minutes=40, done=True) == "Arrays (40 min) [done]"
```

## check format_row drops the marker when not done

No trailing bracket, and no trailing space either.

```python
assert format_row("Arrays", minutes=40) == "Arrays (40 min)"
```

## check minutes and done are keyword-only

Passing them positionally must raise TypeError.

```python
try:
    format_row("Arrays", 40)
    raise AssertionError("minutes should be keyword-only")
except TypeError:
    pass
```

## check summarise formats and sorts the pairs

Sorted by key, joined by comma and space.

```python
assert summarise(minutes=40, title="Arrays") == "minutes=40, title=Arrays"
```

## check summarise handles no arguments

Nothing passed gives an empty string.

```python
assert summarise() == ""
```

## check apply_all chains the functions in order

Each result feeds the next.

```python
assert apply_all(3, lambda n: n + 1, lambda n: n * 2) == 8
```

## check apply_all with no functions returns the value

Nothing to apply means nothing changes.

```python
assert apply_all("x") == "x"
```

## hint after 1

```python
if tags is None:
    tags = []
```

## hint after 2

```python
def format_row(title, *, minutes=0, done=False):
```

## hint after 3

```python
", ".join(f"{k}={v}" for k, v in sorted(fields.items()))
```

## hint after 4

apply_all is a loop reassigning value, or a reduce over the functions.
