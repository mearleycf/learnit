---
type: lesson
title: "Introduction to Python"
description: "Getting started with Python programming"
access: free
references:
  - "https://docs.python.org/3/tutorial/introduction.html"
  - "https://peps.python.org/pep-0008/"
---

You already know JavaScript. This course leans on that: most of the work in learning a second
language is finding out which of your instincts transfer and which quietly do not.

## What is actually different

Three things, and everything else follows from them.

**Indentation is syntax.** There are no braces. The indentation *is* the block, and getting it
wrong is a syntax error rather than a formatting complaint.

```python
if ready:
    start()
    log("started")
print("this runs either way")
```

Four spaces, by overwhelming convention. Your editor will do it. Mixing tabs and spaces is an
error in Python 3, which is a mercy.

**There is no `undefined`.** Python has `None`, and only `None`. Reading a name that was never
assigned raises `NameError` instead of handing you a silent `undefined`. This removes a whole
category of JavaScript bug.

**Types matter more at runtime.** JavaScript coerces eagerly. Python mostly refuses:

```python
"3" + 4     # TypeError
"3" * 4     # "3333"  — this one works, and means repeat
```

The first line is the important one. `"3" + 4` being an error rather than `"34"` catches real
mistakes early.

## Running it

```bash
python3 script.py     # run a file
python3               # a REPL, like node with no arguments
```

There is no build step and no bundler. A `.py` file runs as it is.

## The shape of a program

```python
def greet(name="friend"):
    """Say hello. This string is the docstring, and tooling reads it."""
    return f"Hello, {name}"


if __name__ == "__main__":
    print(greet("Mike"))
```

Things worth noticing against the JavaScript you would write:

- `def`, not `function`. No arrow form; `lambda` exists but is deliberately limited.
- Default arguments look the same and behave differently in one dangerous case, covered in
  chapter 3.
- `f"..."` is a template literal. `f` for format, braces instead of `${}`.
- The docstring is a convention with teeth: `help(greet)` prints it.
- `if __name__ == "__main__"` means "only when run directly, not when imported". A file is a
  module, always, and importing it executes it.

## Naming

`snake_case` for functions and variables, `PascalCase` for classes, `SCREAMING_SNAKE` for
constants. This is not a preference. PEP 8 is the style guide and effectively everyone follows
it, which means reading unfamiliar Python is easier than reading unfamiliar JavaScript.

There is no `const`. An uppercase name is a promise, not an enforcement.

## Truthiness, which is almost the same

Empty things are falsy: `0`, `""`, `[]`, `{}`, `None`, `False`.

The trap for a JavaScript developer is the reverse: **an empty list is falsy in Python and truthy
in JavaScript.**

```python
if items:      # idiomatic: "if there are any items"
    ...
```

```javascript
if (items.length) {  // JavaScript needs the length, because [] is truthy
}
```

This one bites in both directions when you switch between the two in a day.

## What you will miss

No `?.` until you reach `getattr` and `dict.get`. No `&&` returning a value, though `and` and
`or` do the same thing with words. No object literal shorthand. No destructuring in the
JavaScript sense, though tuple unpacking covers most of it and is nicer.

What you gain: a standard library that already contains what you would reach for npm to do.
