---
type: exercise
title: "Python Syntax Basics"
description: "Understanding Python syntax and basic programming concepts"
access: free
entry: "solution.py"
minutes: 15
difficulty: easy
files:
  - name: "solution.py"
    language: python
---

Your first Python. Four small functions, exercising the differences from JavaScript that
the lesson covered.

In **solution.py**:

1. `describe(name, lessons)` returns `"Mike has 3 lessons"`, using an f-string. When
   `lessons` is 1 the word is `lesson`.
2. `whole_days(minutes)` returns the number of whole 60-minute blocks, as an `int`. Remember
   that `/` gives a float and `//` does not.
3. `initials(full_name)` turns `"Ada Lovelace"` into `"AL"`. Assume at least one word.
4. `safe_int(text, fallback=0)` returns the integer in `text`, or `fallback` when it is not a
   number. `int("abc")` raises rather than returning NaN, so catch it.

## file solution.py

```python
# 1. "Mike has 3 lessons", singular when lessons == 1.
def describe(name, lessons):
    return ""


# 2. Whole 60-minute blocks, as an int.
def whole_days(minutes):
    return 0


# 3. "Ada Lovelace" -> "AL"
def initials(full_name):
    return ""


# 4. The integer in text, or fallback when it is not a number.
def safe_int(text, fallback=0):
    return fallback
```

## solution

```python
def describe(name, lessons):
    word = "lesson" if lessons == 1 else "lessons"
    return f"{name} has {lessons} {word}"


def whole_days(minutes):
    return minutes // 60


def initials(full_name):
    return "".join(word[0].upper() for word in full_name.split())


def safe_int(text, fallback=0):
    try:
        return int(text)
    except ValueError:
        return fallback
```

## explanation

The conditional expression in describe reads value-first, which is the reverse of a ternary and takes a moment to get used to. // is floor division and keeps the int, where / would give 2.0 and fail the isinstance check. split() with no argument splits on any whitespace and drops empties, which is what you want for a name. Catching ValueError specifically rather than bare except means a genuine bug still surfaces.

## check describe builds the sentence

An f-string with the name and the count.

```python
assert describe("Mike", 3) == "Mike has 3 lessons"
```

## check describe uses the singular for one lesson

One lesson, not one lessons.

```python
assert describe("Ada", 1) == "Ada has 1 lesson"
```

## check whole_days counts complete blocks

150 minutes is two whole hours, not two and a half.

```python
assert whole_days(150) == 2
```

## check whole_days returns an int, not a float

Using / would give 2.5 here and 2.0 for 120. Use //.

```python
assert whole_days(120) == 2 and isinstance(whole_days(120), int)
```

## check initials takes the first letter of each word

Uppercased, joined, no separator.

```python
assert initials("Ada Lovelace") == "AL"
```

## check initials handles a single name

One word gives one letter.

```python
assert initials("Prince") == "P"
```

## check safe_int parses a number

A numeric string becomes an int.

```python
assert safe_int("42") == 42
```

## check safe_int falls back when the text is not a number

int("abc") raises ValueError; catch it and return the fallback.

```python
assert safe_int("abc") == 0 and safe_int("abc", -1) == -1
```

## hint after 1

```python
f"{name} has {lessons} {'lesson' if lessons == 1 else 'lessons'}"
```

## hint after 2

Use // for whole blocks. / always returns a float, even when it divides evenly.

## hint after 3

```python
"".join(word[0].upper() for word in full_name.split())
```

## hint after 4

```python
try:
    return int(text)
except ValueError:
    return fallback
```
