---
type: lesson
title: "Variables and Data Types"
description: "Learn about Python variables and fundamental data types"
access: free
references:
  - "https://docs.python.org/3/library/stdtypes.html"
  - "https://docs.python.org/3/tutorial/introduction.html#text"
---

The types are mostly familiar. The differences are in the corners, and the corners are where
the bugs live.

## Numbers

Python has two, and the split matters more than JavaScript's single `number`.

```python
count = 10          # int
ratio = 1.5         # float
```

`int` is arbitrary precision. No `Number.MAX_SAFE_INTEGER`, no `BigInt`, no silent loss above
2^53. `2 ** 200` is exact.

Division has two forms, which is the thing to remember:

```python
7 / 2      # 3.5   — always a float, even for 8 / 2
7 // 2     # 3     — floor division, stays an int
7 % 2      # 1
```

`/` returning `3.5` for `7 / 2` but also `4.0` for `8 / 2` surprises people. If you want an
integer, say `//`.

Floats are the same IEEE 754 you already distrust, so `0.1 + 0.2` is still not `0.3`. Use
`decimal.Decimal` for money, exactly as you would reach for a library in JavaScript.

## Strings

Immutable, like JavaScript. Single and double quotes are interchangeable, and triple quotes span
lines.

```python
name = "Mike"
greeting = f"Hello, {name}. You have {3 * 2} lessons left."
```

The methods you know are there with different names:

| JavaScript | Python |
| --- | --- |
| `str.length` | `len(str)` |
| `toUpperCase()` | `upper()` |
| `includes(x)` | `x in str` |
| `slice(1, 3)` | `str[1:3]` |
| `split(",")` | `split(",")` |
| `arr.join(",")` | `",".join(arr)` |

`len()` being a function rather than a property is the first thing that will trip you, and
`"".join(list)` reads backwards until it does not.

Slicing works on any sequence and is worth learning properly:

```python
s = "learnit"
s[0]        # "l"
s[-1]       # "t"      — negative counts from the end
s[1:4]      # "ear"
s[:3]       # "lea"
s[::-1]     # "tinrael" — reversed
```

## None, and why it is better than undefined

```python
result = None
if result is None:
    ...
```

Use `is None`, not `== None`. `is` compares identity, and `None` is a singleton, so identity is
exactly the right question. `==` can be overridden by a class and occasionally lies.

Python has no equivalent of the `undefined` versus `null` distinction, and nobody misses it.

## Booleans and comparison

`True` and `False`, capitalised. `and`, `or`, `not` instead of `&&`, `||`, `!`.

There is only one equality operator. `==` compares values and does not coerce across types the
way JavaScript's does, so there is no `===` to reach for.

One genuine delight: comparisons chain.

```python
if 0 <= position < duration:
    ...
```

That means what you would hope, and in JavaScript it means something useless.

## Conversion is explicit

```python
int("42")        # 42
str(42)          # "42"
float("1.5")     # 1.5
int("abc")       # ValueError, immediately
```

`int("abc")` raising rather than returning `NaN` is the general pattern: Python prefers an error
now over a wrong value later.

## Multiple assignment

```python
x, y = 1, 2
x, y = y, x              # swap, no temporary
first, *rest = [1, 2, 3] # first = 1, rest = [2, 3]
```

This is tuple unpacking, and it covers most of what you use array destructuring for.
