---
type: recap
title: "Python Basics Recap"
description: "Review fundamental Python concepts and practices"
access: free
---

Indentation is syntax, there is no undefined, and Python refuses most of the coercion JavaScript performs. The type names are familiar; the corners differ. Most of what you know transfers, and the places it does not are worth learning deliberately rather than discovering in a stack trace.

## key points

- Indentation defines blocks. Four spaces, and mixing tabs with spaces is an error.
- There is no `undefined`. Reading an unassigned name raises NameError rather than returning something.
- `"3" + 4` is a TypeError. Python coerces far less than JavaScript.
- `int` is arbitrary precision, so there is no MAX_SAFE_INTEGER and no BigInt.
- `/` always returns a float; use `//` when you want an integer.
- `len(x)` is a function, not a property, and `",".join(list)` reads backwards at first.
- Use `is None`, never `== None`, because None is a singleton and identity is the right question.
- An empty list is falsy in Python and truthy in JavaScript. This catches people switching daily.
- Comparisons chain: `0 <= n < 10` means what you would hope.
- Conversion is explicit and raises on failure rather than producing NaN.
