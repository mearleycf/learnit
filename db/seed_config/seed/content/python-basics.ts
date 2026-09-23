/**
 * Authored content for Python Fundamentals, chapters 1 and 2.
 *
 * Written for someone who already knows JavaScript, which is the audience.
 * Comparisons to JavaScript are the point, not a crutch: the fastest way into
 * a second language is knowing where your instincts transfer and where they
 * quietly do not.
 *
 * No exercises here. Python cannot execute in the runner; see the vault
 * questions.
 */

export const introToPythonLesson = {
  markdown: `You already know JavaScript. This course leans on that: most of the work in learning a second
language is finding out which of your instincts transfer and which quietly do not.

## What is actually different

Three things, and everything else follows from them.

**Indentation is syntax.** There are no braces. The indentation *is* the block, and getting it
wrong is a syntax error rather than a formatting complaint.

\`\`\`python
if ready:
    start()
    log("started")
print("this runs either way")
\`\`\`

Four spaces, by overwhelming convention. Your editor will do it. Mixing tabs and spaces is an
error in Python 3, which is a mercy.

**There is no \`undefined\`.** Python has \`None\`, and only \`None\`. Reading a name that was never
assigned raises \`NameError\` instead of handing you a silent \`undefined\`. This removes a whole
category of JavaScript bug.

**Types matter more at runtime.** JavaScript coerces eagerly. Python mostly refuses:

\`\`\`python
"3" + 4     # TypeError
"3" * 4     # "3333"  — this one works, and means repeat
\`\`\`

The first line is the important one. \`"3" + 4\` being an error rather than \`"34"\` catches real
mistakes early.

## Running it

\`\`\`bash
python3 script.py     # run a file
python3               # a REPL, like node with no arguments
\`\`\`

There is no build step and no bundler. A \`.py\` file runs as it is.

## The shape of a program

\`\`\`python
def greet(name="friend"):
    """Say hello. This string is the docstring, and tooling reads it."""
    return f"Hello, {name}"


if __name__ == "__main__":
    print(greet("Mike"))
\`\`\`

Things worth noticing against the JavaScript you would write:

- \`def\`, not \`function\`. No arrow form; \`lambda\` exists but is deliberately limited.
- Default arguments look the same and behave differently in one dangerous case, covered in
  chapter 3.
- \`f"..."\` is a template literal. \`f\` for format, braces instead of \`${'${}'}\`.
- The docstring is a convention with teeth: \`help(greet)\` prints it.
- \`if __name__ == "__main__"\` means "only when run directly, not when imported". A file is a
  module, always, and importing it executes it.

## Naming

\`snake_case\` for functions and variables, \`PascalCase\` for classes, \`SCREAMING_SNAKE\` for
constants. This is not a preference. PEP 8 is the style guide and effectively everyone follows
it, which means reading unfamiliar Python is easier than reading unfamiliar JavaScript.

There is no \`const\`. An uppercase name is a promise, not an enforcement.

## Truthiness, which is almost the same

Empty things are falsy: \`0\`, \`""\`, \`[]\`, \`{}\`, \`None\`, \`False\`.

The trap for a JavaScript developer is the reverse: **an empty list is falsy in Python and truthy
in JavaScript.**

\`\`\`python
if items:      # idiomatic: "if there are any items"
    ...
\`\`\`

\`\`\`javascript
if (items.length) {  // JavaScript needs the length, because [] is truthy
}
\`\`\`

This one bites in both directions when you switch between the two in a day.

## What you will miss

No \`?.\` until you reach \`getattr\` and \`dict.get\`. No \`&&\` returning a value, though \`and\` and
\`or\` do the same thing with words. No object literal shorthand. No destructuring in the
JavaScript sense, though tuple unpacking covers most of it and is nicer.

What you gain: a standard library that already contains what you would reach for npm to do.`,
  references: ['https://docs.python.org/3/tutorial/introduction.html', 'https://peps.python.org/pep-0008/'],
}

export const variablesLesson = {
  markdown: `The types are mostly familiar. The differences are in the corners, and the corners are where
the bugs live.

## Numbers

Python has two, and the split matters more than JavaScript's single \`number\`.

\`\`\`python
count = 10          # int
ratio = 1.5         # float
\`\`\`

\`int\` is arbitrary precision. No \`Number.MAX_SAFE_INTEGER\`, no \`BigInt\`, no silent loss above
2^53. \`2 ** 200\` is exact.

Division has two forms, which is the thing to remember:

\`\`\`python
7 / 2      # 3.5   — always a float, even for 8 / 2
7 // 2     # 3     — floor division, stays an int
7 % 2      # 1
\`\`\`

\`/\` returning \`3.5\` for \`7 / 2\` but also \`4.0\` for \`8 / 2\` surprises people. If you want an
integer, say \`//\`.

Floats are the same IEEE 754 you already distrust, so \`0.1 + 0.2\` is still not \`0.3\`. Use
\`decimal.Decimal\` for money, exactly as you would reach for a library in JavaScript.

## Strings

Immutable, like JavaScript. Single and double quotes are interchangeable, and triple quotes span
lines.

\`\`\`python
name = "Mike"
greeting = f"Hello, {name}. You have {3 * 2} lessons left."
\`\`\`

The methods you know are there with different names:

| JavaScript | Python |
| --- | --- |
| \`str.length\` | \`len(str)\` |
| \`toUpperCase()\` | \`upper()\` |
| \`includes(x)\` | \`x in str\` |
| \`slice(1, 3)\` | \`str[1:3]\` |
| \`split(",")\` | \`split(",")\` |
| \`arr.join(",")\` | \`",".join(arr)\` |

\`len()\` being a function rather than a property is the first thing that will trip you, and
\`"".join(list)\` reads backwards until it does not.

Slicing works on any sequence and is worth learning properly:

\`\`\`python
s = "learnit"
s[0]        # "l"
s[-1]       # "t"      — negative counts from the end
s[1:4]      # "ear"
s[:3]       # "lea"
s[::-1]     # "tinrael" — reversed
\`\`\`

## None, and why it is better than undefined

\`\`\`python
result = None
if result is None:
    ...
\`\`\`

Use \`is None\`, not \`== None\`. \`is\` compares identity, and \`None\` is a singleton, so identity is
exactly the right question. \`==\` can be overridden by a class and occasionally lies.

Python has no equivalent of the \`undefined\` versus \`null\` distinction, and nobody misses it.

## Booleans and comparison

\`True\` and \`False\`, capitalised. \`and\`, \`or\`, \`not\` instead of \`&&\`, \`||\`, \`!\`.

There is only one equality operator. \`==\` compares values and does not coerce across types the
way JavaScript's does, so there is no \`===\` to reach for.

One genuine delight: comparisons chain.

\`\`\`python
if 0 <= position < duration:
    ...
\`\`\`

That means what you would hope, and in JavaScript it means something useless.

## Conversion is explicit

\`\`\`python
int("42")        # 42
str(42)          # "42"
float("1.5")     # 1.5
int("abc")       # ValueError, immediately
\`\`\`

\`int("abc")\` raising rather than returning \`NaN\` is the general pattern: Python prefers an error
now over a wrong value later.

## Multiple assignment

\`\`\`python
x, y = 1, 2
x, y = y, x              # swap, no temporary
first, *rest = [1, 2, 3] # first = 1, rest = [2, 3]
\`\`\`

This is tuple unpacking, and it covers most of what you use array destructuring for.`,
  references: [
    'https://docs.python.org/3/library/stdtypes.html',
    'https://docs.python.org/3/tutorial/introduction.html#text',
  ],
}

export const pythonBasicsRecap = {
  summary:
    'Indentation is syntax, there is no undefined, and Python refuses most of the coercion ' +
    'JavaScript performs. The type names are familiar; the corners differ. Most of what you ' +
    'know transfers, and the places it does not are worth learning deliberately rather than ' +
    'discovering in a stack trace.',
  key_points: [
    'Indentation defines blocks. Four spaces, and mixing tabs with spaces is an error.',
    'There is no `undefined`. Reading an unassigned name raises NameError rather than returning something.',
    '`"3" + 4` is a TypeError. Python coerces far less than JavaScript.',
    '`int` is arbitrary precision, so there is no MAX_SAFE_INTEGER and no BigInt.',
    '`/` always returns a float; use `//` when you want an integer.',
    '`len(x)` is a function, not a property, and `",".join(list)` reads backwards at first.',
    'Use `is None`, never `== None`, because None is a singleton and identity is the right question.',
    'An empty list is falsy in Python and truthy in JavaScript. This catches people switching daily.',
    'Comparisons chain: `0 <= n < 10` means what you would hope.',
    'Conversion is explicit and raises on failure rather than producing NaN.',
  ],
}

export const listsLesson = {
  markdown: `Python's collections are where the standard library starts paying for itself.

## Lists are arrays

\`\`\`python
lessons = ["Variables", "Functions", "Arrays"]
lessons.append("Objects")      # push
lessons[0]                     # "Variables"
len(lessons)                   # 4
\`\`\`

The methods map closely enough:

| JavaScript | Python |
| --- | --- |
| \`push(x)\` | \`append(x)\` |
| \`pop()\` | \`pop()\` |
| \`shift()\` | \`pop(0)\` |
| \`unshift(x)\` | \`insert(0, x)\` |
| \`concat(b)\` | \`a + b\` |
| \`indexOf(x)\` | \`index(x)\`, which raises if absent |
| \`includes(x)\` | \`x in list\` |

\`index\` raising rather than returning \`-1\` is the pattern again. Ask \`in\` first if you are not
sure.

## Comprehensions replace map and filter

This is the piece of Python worth learning first, because idiomatic code is full of it.

\`\`\`python
titles = [lesson.title for lesson in lessons]                    # map
short = [l for l in lessons if l.minutes < 30]                   # filter
names = [l.title.upper() for l in lessons if not l.done]         # both
\`\`\`

Read it left to right as: what I want, where it comes from, which ones. The JavaScript is
\`lessons.filter(l => !l.done).map(l => l.title.toUpperCase())\`, and once your eye adjusts the
Python is shorter and reads in the same order as the sentence.

\`map\` and \`filter\` do exist. Nobody uses them, because a comprehension is clearer.

Dictionary and set comprehensions use the same shape:

\`\`\`python
by_title = {l.title: l for l in lessons}
all_tags = {tag for l in lessons for tag in l.tags}   # a set, so deduplicated
\`\`\`

## Tuples are immutable lists

\`\`\`python
point = (3, 4)
x, y = point        # unpacking
\`\`\`

Use a tuple when the length is part of the meaning: a coordinate, a record, a function returning
two things. Use a list when it is a collection that could grow.

Tuples being immutable means they can be dictionary keys. Lists cannot.

\`\`\`python
cache = {(1, 2): "result"}
\`\`\`

## Dictionaries are objects, done better

\`\`\`python
lesson = {"title": "Arrays", "minutes": 40}
lesson["title"]              # KeyError if missing
lesson.get("title")          # None if missing
lesson.get("title", "none")  # a default
\`\`\`

\`.get()\` is the \`?.\` you were looking for.

Keys can be any immutable value, not just strings. There is no numeric-key coercion, so \`1\` and
\`"1"\` are different keys, which is what you wanted all along.

Iterating gives you keys, and you almost always want \`.items()\`:

\`\`\`python
for key in lesson: ...
for key, value in lesson.items(): ...
\`\`\`

Since Python 3.7 dictionaries keep insertion order, which is guaranteed rather than incidental.

## Sets

\`\`\`python
tags = {"core", "data"}
tags.add("core")        # already there, no change
"core" in tags          # fast
a | b                   # union
a & b                   # intersection
a - b                   # difference
\`\`\`

JavaScript's \`Set\` has no operators for these, so you write loops. Python's are the reason
deduplicating in Python is a one-liner.

## Copying

The trap that catches everyone once:

\`\`\`python
a = [1, 2, 3]
b = a           # the same list, not a copy
b.append(4)
a               # [1, 2, 3, 4]

b = a[:]        # a copy
b = list(a)     # also a copy
\`\`\`

Same as JavaScript's reference semantics, with a different-looking spread.`,
  references: [
    'https://docs.python.org/3/tutorial/datastructures.html',
    'https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions',
  ],
}

export const dataStructuresRecap = {
  summary:
    'Lists, tuples, dictionaries and sets cover almost everything. Comprehensions replace map ' +
    'and filter and are what idiomatic Python looks like. The standard library has already ' +
    'solved most of what you would install a package for in JavaScript.',
  key_points: [
    'Lists are arrays; the method names differ but the ideas do not.',
    '`index(x)` raises when absent, so ask `x in list` first if unsure.',
    'A comprehension reads as: what I want, where from, which ones. Learn this before anything else.',
    'Dictionary and set comprehensions use the same shape as list ones.',
    'Tuples are immutable, which is why they can be dictionary keys and lists cannot.',
    '`dict.get(key, default)` is the optional chaining you are looking for.',
    'Dictionary keys are not coerced, so `1` and `"1"` stay different keys.',
    'Iterating a dictionary gives keys; use `.items()` for pairs.',
    'Sets have real operators: `|`, `&`, `-` for union, intersection and difference.',
    '`b = a` shares the list. Use `a[:]` or `list(a)` for a copy.',
  ],
}
