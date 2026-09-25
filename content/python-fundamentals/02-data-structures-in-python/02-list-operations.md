---
type: exercise
title: "List Operations"
description: "Working with Python lists"
access: free
entry: "lists.py"
minutes: 25
difficulty: medium
files:
  - name: "catalogue.py"
    language: python
    readonly: true
  - name: "lists.py"
    language: python
---

Comprehensions, dictionaries and sets, over the same lesson catalogue as the JavaScript course.

**catalogue.py** (read only) exports `LESSONS`, a list of dicts with `title`, `minutes`,
`done` and `tags`.

In **lists.py**:

1. `titles(lessons)` returns every title, in order.
2. `unfinished(lessons)` returns the lessons that are not done.
3. `by_tag(lessons)` returns a dict mapping each tag to the titles carrying it, in the order
   the lessons appear.
4. `all_tags(lessons)` returns every tag, deduplicated and sorted.
5. `longest_title(lessons)` returns the longest title, breaking a tie by taking the earlier one.
   An empty list gives `None`.

Write 1, 2 and 4 as comprehensions. You could use loops; the point is to get comfortable with
the shape.

## file catalogue.py

```python
# The lessons your functions are asked about. You do not need to change this.

LESSONS = [
    {"title": "Arrays", "minutes": 40, "done": False, "tags": ["data", "core"]},
    {"title": "Variables", "minutes": 20, "done": True, "tags": ["core"]},
    {"title": "Objects", "minutes": 25, "done": False, "tags": ["data", "core"]},
    {"title": "Functions", "minutes": 35, "done": True, "tags": ["core", "logic"]},
]
```

## file lists.py

```python
from catalogue import LESSONS


# 1. Every title, in order. A comprehension.
def titles(lessons):
    return []


# 2. The lessons that are not done. A comprehension.
def unfinished(lessons):
    return []


# 3. {tag: [titles]}, in the order the lessons appear.
def by_tag(lessons):
    return {}


# 4. Every tag, deduplicated and sorted. A comprehension plus a set.
def all_tags(lessons):
    return []


# 5. The longest title, earliest on a tie. None when empty.
def longest_title(lessons):
    return None
```

## solution

```python
from catalogue import LESSONS


def titles(lessons):
    return [lesson["title"] for lesson in lessons]


def unfinished(lessons):
    return [lesson for lesson in lessons if not lesson["done"]]


def by_tag(lessons):
    groups = {}
    for lesson in lessons:
        for tag in lesson["tags"]:
            groups.setdefault(tag, []).append(lesson["title"])
    return groups


def all_tags(lessons):
    return sorted({tag for lesson in lessons for tag in lesson["tags"]})


def longest_title(lessons):
    if not lessons:
        return None
    return max(lessons, key=lambda lesson: len(lesson["title"]))["title"]
```

## explanation

setdefault creates the list the first time a tag appears and returns it either way, which is the idiomatic grouping line. The set comprehension in all_tags has two for clauses, read left to right as nested loops, and sorted() turns the set back into an ordered list. max() returns the first maximum it encounters, so the tie rule falls out rather than needing a comparison.

## check titles returns every title in order

Order follows the input, not the alphabet.

```python
assert titles(LESSONS) == ["Arrays", "Variables", "Objects", "Functions"]
```

## check titles handles an empty list

No lessons gives no titles.

```python
assert titles([]) == []
```

## check unfinished keeps only lessons that are not done

Two of the four seeded lessons are unfinished.

```python
assert [l["title"] for l in unfinished(LESSONS)] == ["Arrays", "Objects"]
```

## check by_tag groups titles under every tag

A lesson with two tags appears under both.

```python
assert by_tag([{"title": "A", "tags": ["x", "y"]}, {"title": "B", "tags": ["x"]}]) == {"x": ["A", "B"], "y": ["A"]}
```

## check by_tag keeps the order the lessons appear in

Not alphabetical, and not reversed.

```python
assert by_tag([{"title": "Zed", "tags": ["x"]}, {"title": "Amy", "tags": ["x"]}])["x"] == ["Zed", "Amy"]
```

## check by_tag returns an empty dict for an empty list

No lessons means no tags.

```python
assert by_tag([]) == {}
```

## check all_tags deduplicates and sorts

Each tag once, alphabetically.

```python
assert all_tags(LESSONS) == ["core", "data", "logic"]
```

## check all_tags returns a list, not a set

Sorted output has to be a list; a set has no order.

```python
assert isinstance(all_tags(LESSONS), list)
```

## check longest_title picks the longest

Variables is nine characters, the longest of the four.

```python
assert longest_title(LESSONS) == "Variables"
```

## check longest_title keeps the earlier one on a tie

Two titles of equal length: the first wins.

```python
assert longest_title([{"title": "abc"}, {"title": "xyz"}]) == "abc"
```

## check longest_title returns None for an empty list

Nothing to pick.

```python
assert longest_title([]) is None
```

## hint after 1

```python
return [lesson["title"] for lesson in lessons]
```

## hint after 2

```python
groups.setdefault(tag, []).append(lesson["title"])
```

## hint after 3

```python
return sorted({tag for lesson in lessons for tag in lesson["tags"]})
```

## hint after 4

max() with a key takes the first maximum it meets, which is the tie rule you want. Guard the empty case first.
