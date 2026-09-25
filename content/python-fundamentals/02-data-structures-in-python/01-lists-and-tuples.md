---
type: lesson
title: "Lists and Tuples"
description: "Understanding Python sequences: lists and tuples"
access: free
references:
  - "https://docs.python.org/3/tutorial/datastructures.html"
  - "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions"
---

Python's collections are where the standard library starts paying for itself.

## Lists are arrays

```python
lessons = ["Variables", "Functions", "Arrays"]
lessons.append("Objects")      # push
lessons[0]                     # "Variables"
len(lessons)                   # 4
```

The methods map closely enough:

| JavaScript | Python |
| --- | --- |
| `push(x)` | `append(x)` |
| `pop()` | `pop()` |
| `shift()` | `pop(0)` |
| `unshift(x)` | `insert(0, x)` |
| `concat(b)` | `a + b` |
| `indexOf(x)` | `index(x)`, which raises if absent |
| `includes(x)` | `x in list` |

`index` raising rather than returning `-1` is the pattern again. Ask `in` first if you are not
sure.

## Comprehensions replace map and filter

This is the piece of Python worth learning first, because idiomatic code is full of it.

```python
titles = [lesson.title for lesson in lessons]                    # map
short = [l for l in lessons if l.minutes < 30]                   # filter
names = [l.title.upper() for l in lessons if not l.done]         # both
```

Read it left to right as: what I want, where it comes from, which ones. The JavaScript is
`lessons.filter(l => !l.done).map(l => l.title.toUpperCase())`, and once your eye adjusts the
Python is shorter and reads in the same order as the sentence.

`map` and `filter` do exist. Nobody uses them, because a comprehension is clearer.

Dictionary and set comprehensions use the same shape:

```python
by_title = {l.title: l for l in lessons}
all_tags = {tag for l in lessons for tag in l.tags}   # a set, so deduplicated
```

## Tuples are immutable lists

```python
point = (3, 4)
x, y = point        # unpacking
```

Use a tuple when the length is part of the meaning: a coordinate, a record, a function returning
two things. Use a list when it is a collection that could grow.

Tuples being immutable means they can be dictionary keys. Lists cannot.

```python
cache = {(1, 2): "result"}
```

## Dictionaries are objects, done better

```python
lesson = {"title": "Arrays", "minutes": 40}
lesson["title"]              # KeyError if missing
lesson.get("title")          # None if missing
lesson.get("title", "none")  # a default
```

`.get()` is the `?.` you were looking for.

Keys can be any immutable value, not just strings. There is no numeric-key coercion, so `1` and
`"1"` are different keys, which is what you wanted all along.

Iterating gives you keys, and you almost always want `.items()`:

```python
for key in lesson: ...
for key, value in lesson.items(): ...
```

Since Python 3.7 dictionaries keep insertion order, which is guaranteed rather than incidental.

## Sets

```python
tags = {"core", "data"}
tags.add("core")        # already there, no change
"core" in tags          # fast
a | b                   # union
a & b                   # intersection
a - b                   # difference
```

JavaScript's `Set` has no operators for these, so you write loops. Python's are the reason
deduplicating in Python is a one-liner.

## Copying

The trap that catches everyone once:

```python
a = [1, 2, 3]
b = a           # the same list, not a copy
b.append(4)
a               # [1, 2, 3, 4]

b = a[:]        # a copy
b = list(a)     # also a copy
```

Same as JavaScript's reference semantics, with a different-looking spread.
