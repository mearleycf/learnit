/**
 * Authored content for Python Fundamentals, chapter 3.
 *
 * Written for a JavaScript developer. No exercises: Python cannot execute in
 * the runner; see the vault questions.
 */

export const functionBasicsLesson = {
  markdown: `Functions look familiar and differ in three ways that matter.

## The basic shape

\`\`\`python
def estimate(minutes, per_day=30):
    """Days needed to finish, rounding up."""
    return -(-minutes // per_day)
\`\`\`

\`def\`, a docstring by convention, and a default argument that looks like JavaScript's.

There is no arrow function. \`lambda\` exists and is deliberately crippled to a single
expression:

\`\`\`python
by_length = sorted(titles, key=lambda t: len(t))
\`\`\`

That is essentially all \`lambda\` is for: a one-expression callback passed to something else. If
it needs two lines, write a \`def\`. Python's authors made this awkward on purpose.

## Keyword arguments, which you will end up loving

Any parameter can be passed by name.

\`\`\`python
def split(text, separator=",", limit=None):
    ...

split("a,b,c", limit=2)                # skip separator entirely
split(text="a,b", separator=";")       # name everything
\`\`\`

This removes the options-object pattern. In JavaScript you write
\`split(text, { limit: 2 })\` to avoid a positional boolean; in Python the language does it.

You can force the issue:

\`\`\`python
def connect(host, *, timeout=30, retries=3):
    ...

connect("localhost", timeout=5)   # fine
connect("localhost", 5)           # TypeError
\`\`\`

Everything after \`*\` must be passed by name. Worth doing for any parameter whose meaning is not
obvious at the call site, which is most booleans.

## The mutable default argument

This is the one genuine trap in Python function definitions, and everyone hits it once.

\`\`\`python
def add(item, items=[]):     # wrong
    items.append(item)
    return items

add("a")    # ["a"]
add("b")    # ["a", "b"]   — the same list, still there
\`\`\`

The default is evaluated **once, when the function is defined**, not on each call. A mutable
default is therefore shared by every call that does not supply one.

The fix is always the same:

\`\`\`python
def add(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
\`\`\`

Linters catch this. Know why it happens anyway, because the same evaluation-once rule explains
other surprises.

## Returning several things

\`\`\`python
def stats(numbers):
    return min(numbers), max(numbers), sum(numbers) / len(numbers)

low, high, mean = stats([1, 2, 3])
\`\`\`

That is a tuple and then unpacking. It replaces JavaScript's "return an object and destructure",
with the caveat that position matters, so three values is about the limit before you should
return something named.

## Arguments and their names

\`\`\`python
def log(message, *args, **kwargs):
    ...
\`\`\`

\`*args\` is a tuple of extra positional arguments, the rest parameter you know. \`**kwargs\` is a
dictionary of extra keyword arguments, which JavaScript has no equivalent for.

At a call site the same symbols spread:

\`\`\`python
log("hi", *values, **options)
\`\`\`

## Scope

Python has no \`let\` or \`const\`. Assignment creates a local name, and reading a name that only
exists outside is fine, but assigning to it is not:

\`\`\`python
count = 0

def increment():
    count += 1      # UnboundLocalError
\`\`\`

The assignment makes \`count\` local to \`increment\`, so the read on the right happens before it
has a value. Say \`global count\`, or better, return the new value and let the caller assign it.

Closures work as you expect, and the late-binding gotcha in a loop is the same one JavaScript
had before \`let\`.`,
  references: [
    'https://docs.python.org/3/tutorial/controlflow.html#defining-functions',
    'https://docs.python.org/3/faq/programming.html#why-are-default-values-shared-between-objects',
  ],
}

export const advancedFunctionsLesson = {
  markdown: `Decorators, generators and the parts of the standard library you would otherwise reinvent.

## Decorators

A decorator is a function that takes a function and returns a replacement.

\`\`\`python
def logged(fn):
    def wrapper(*args, **kwargs):
        print(f"calling {fn.__name__}")
        return fn(*args, **kwargs)
    return wrapper


@logged
def seed_database():
    ...
\`\`\`

\`@logged\` above a definition means exactly \`seed_database = logged(seed_database)\`. That is the
whole feature. Everything else is convention.

The \`*args, **kwargs\` in the wrapper is what lets it wrap any function without knowing its
signature.

One thing worth doing properly:

\`\`\`python
import functools

def logged(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper
\`\`\`

Without \`functools.wraps\`, the wrapper replaces the original's name and docstring, and every
debugging session afterwards shows \`wrapper\` instead of the real function.

You will meet decorators constantly in frameworks: \`@property\`, \`@staticmethod\`,
\`@app.route(...)\`, \`@pytest.fixture\`.

## Caching, for free

\`\`\`python
@functools.cache
def fibonacci(n):
    return n if n < 2 else fibonacci(n - 1) + fibonacci(n - 2)
\`\`\`

That is the memoize you wrote by hand in the React course, in the standard library, one line.
\`functools.lru_cache(maxsize=1000)\` when unbounded growth would be a problem.

## Generators

A function with \`yield\` returns a generator: values produced one at a time, on demand.

\`\`\`python
def lines_of(path):
    with open(path) as file:
        for line in file:
            yield line.rstrip()
\`\`\`

Nothing runs until you iterate, and only one line is in memory at a time. The equivalent
JavaScript is \`function*\`, which you have probably never reached for; in Python it is everyday.

\`\`\`python
squares = (n * n for n in range(1_000_000))   # a generator, not a list
\`\`\`

Parentheses instead of brackets makes a comprehension lazy. The list version would allocate a
million integers; this one allocates almost nothing.

## with, which is try/finally worth using

\`\`\`python
with open("data.json") as file:
    contents = file.read()
# closed here, even if read() raised
\`\`\`

JavaScript has no equivalent, which is why every file example there has a \`finally\` block or a
leak. Anything holding a resource supports this: files, locks, database connections, temporary
directories.

## Unpacking in calls and definitions

\`\`\`python
def render(title, minutes, done=False):
    ...

lesson = {"title": "Arrays", "minutes": 40}
render(**lesson)          # keys become keyword arguments
\`\`\`

This is the closest thing to passing an options object, and it type-checks at the call rather
than inside the function.

## Type hints

Optional, unenforced at runtime, and increasingly expected:

\`\`\`python
def estimate(minutes: int, per_day: int = 30) -> int:
    return -(-minutes // per_day)
\`\`\`

Nothing checks these when the program runs. \`mypy\` or \`pyright\` checks them the way \`tsc\`
checks TypeScript, and the mental model is close enough that you will be at home immediately.
The difference is that Python runs regardless, so hints are documentation with a tool attached
rather than a gate.`,
  references: [
    'https://docs.python.org/3/glossary.html#term-decorator',
    'https://docs.python.org/3/library/functools.html',
    'https://docs.python.org/3/tutorial/classes.html#generators',
  ],
}

export const functionsRecap = {
  summary:
    'Functions differ from JavaScript in three ways worth knowing: keyword arguments remove the ' +
    'options-object pattern, a mutable default argument is shared between calls, and decorators ' +
    'are just a function that wraps a function. Generators and `with` are everyday tools in ' +
    'Python that you rarely reach for in JavaScript.',
  key_points: [
    'No arrow functions. `lambda` is one expression on purpose; anything longer wants a `def`.',
    'Any parameter can be passed by name, which replaces the options-object pattern.',
    'A `*` in the signature forces everything after it to be keyword-only. Use it for booleans.',
    'A mutable default argument is evaluated once and shared. Default to None and build inside.',
    'Returning several values returns a tuple, which the caller unpacks.',
    '`*args` is the rest parameter; `**kwargs` has no JavaScript equivalent.',
    'Assigning to an outer name makes it local, causing UnboundLocalError on the read.',
    '`@decorator` means `fn = decorator(fn)`, and wrappers should use `functools.wraps`.',
    '`functools.cache` is a one-line memoize in the standard library.',
    '`yield` makes a generator: lazy, one value at a time, small in memory.',
    '`with` guarantees cleanup, which JavaScript has no equivalent for.',
    'Type hints are unenforced at runtime; mypy or pyright checks them like tsc does.',
  ],
}
