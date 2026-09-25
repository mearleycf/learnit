---
type: recap
title: "Data Structures Recap"
description: "Review of Python data structures concepts"
access: free
---

Lists, tuples, dictionaries and sets cover almost everything. Comprehensions replace map and filter and are what idiomatic Python looks like. The standard library has already solved most of what you would install a package for in JavaScript.

## key points

- Lists are arrays; the method names differ but the ideas do not.
- `index(x)` raises when absent, so ask `x in list` first if unsure.
- A comprehension reads as: what I want, where from, which ones. Learn this before anything else.
- Dictionary and set comprehensions use the same shape as list ones.
- Tuples are immutable, which is why they can be dictionary keys and lists cannot.
- `dict.get(key, default)` is the optional chaining you are looking for.
- Dictionary keys are not coerced, so `1` and `"1"` stay different keys.
- Iterating a dictionary gives keys; use `.items()` for pairs.
- Sets have real operators: `|`, `&`, `-` for union, intersection and difference.
- `b = a` shares the list. Use `a[:]` or `list(a)` for a copy.
