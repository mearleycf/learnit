---
type: exercise
title: "Module Development"
description: "Practice creating Python modules"
access: free
entry: "report.py"
minutes: 25
difficulty: medium
files:
  - name: "formatting.py"
    language: python
    readonly: true
  - name: "timing.py"
    language: python
    readonly: true
  - name: "report.py"
    language: python
---

Split code across modules, the way a real project does.

Three files. **formatting.py** and **timing.py** are written for you and read only.
**report.py** is yours, and it imports from both.

1. Import `pluralise` and `titlecase` from `formatting`, and `humanise` from `timing`.
2. Export `line(lesson)` returning `"Arrays — 40 minutes"`, with the title titlecased and
   the duration humanised. A lesson is `{"title": ..., "minutes": ...}`.
3. Export `report(lessons)` returning one line per lesson, joined by newlines, with a final
   summary line `"3 lessons, 1 hour 35 minutes total"`. Pluralise "lesson" correctly.
4. Export `MODULE_NAME`, set to this module's own `__name__`. It should be `"report"` when
   imported, which is what the check asserts.

## file formatting.py

```python
# Text helpers. You do not need to change this file.


def pluralise(count, word):
    return word if count == 1 else word + "s"


def titlecase(text):
    return " ".join(part.capitalize() for part in text.split())
```

## file timing.py

```python
# Duration helpers. You do not need to change this file.

from formatting import pluralise


def humanise(minutes):
    """40 -> "40 minutes"; 95 -> "1 hour 35 minutes"; 60 -> "1 hour"."""
    hours, rest = divmod(minutes, 60)
    parts = []
    if hours:
        parts.append(f"{hours} {pluralise(hours, 'hour')}")
    if rest or not hours:
        parts.append(f"{rest} {pluralise(rest, 'minute')}")
    return " ".join(parts)
```

## file report.py

```python
# 1. Import pluralise and titlecase from formatting, humanise from timing.


# 4. This module's own __name__.
MODULE_NAME = ""


# 2. "Arrays — 40 minutes", titlecased and humanised.
def line(lesson):
    return ""


# 3. One line per lesson, then a summary line.
def report(lessons):
    return ""
```

## solution

```python
from formatting import pluralise, titlecase
from timing import humanise

MODULE_NAME = __name__


def line(lesson):
    return f"{titlecase(lesson['title'])} \u2014 {humanise(lesson['minutes'])}"


def report(lessons):
    lines = [line(lesson) for lesson in lessons]
    total = sum(lesson["minutes"] for lesson in lessons)
    count = len(lessons)
    lines.append(f"{count} {pluralise(count, 'lesson')}, {humanise(total)} total")
    return "\n".join(lines)
```

## explanation

The imports are plain module-level imports, exactly as they would be on disk; nothing about running in a browser changes them. __name__ is a module-level name Python sets for you, which is the same mechanism behind the `if __name__ == "__main__"` guard. Note the single quotes inside the f-string: the outer string uses double quotes, so the dict key has to use the other kind.

## check the helper modules import cleanly

formatting and timing are available, and timing uses formatting.

```python
from timing import humanise
from formatting import titlecase
assert humanise(95) == "1 hour 35 minutes"
assert titlecase("array methods") == "Array Methods"
```

## check line formats a single lesson

Title titlecased, an em dash, then the humanised duration.

```python
assert line({"title": "arrays", "minutes": 40}) == "Arrays \u2014 40 minutes"
```

## check line humanises an hour or more

Ninety-five minutes reads as one hour thirty-five.

```python
assert line({"title": "objects", "minutes": 95}) == "Objects \u2014 1 hour 35 minutes"
```

## check report lists every lesson

One line each, newline separated.

```python
out = report([{"title": "a", "minutes": 10}, {"title": "b", "minutes": 20}])
assert out.split("\n")[0] == "A \u2014 10 minutes"
assert out.split("\n")[1] == "B \u2014 20 minutes"
```

## check report ends with a summary line

Count, the word lessons, and the total duration.

```python
out = report([{"title": "a", "minutes": 40}, {"title": "b", "minutes": 35}, {"title": "c", "minutes": 20}])
assert out.split("\n")[-1] == "3 lessons, 1 hour 35 minutes total"
```

## check report uses the singular for one lesson

One lesson, not one lessons.

```python
out = report([{"title": "a", "minutes": 10}])
assert out.split("\n")[-1] == "1 lesson, 10 minutes total"
```

## check MODULE_NAME is the module’s own name

__name__ is "report" when the module is imported.

```python
assert MODULE_NAME == "report"
```

## hint after 1

```python
from formatting import pluralise, titlecase
from timing import humanise
```

## hint after 2

```python
MODULE_NAME = __name__
```

## hint after 3

```python
f"{titlecase(lesson['title'])} \u2014 {humanise(lesson['minutes'])}"
```

## hint after 4

Build the lines with a comprehension, append the summary, then join the whole list with newlines.
