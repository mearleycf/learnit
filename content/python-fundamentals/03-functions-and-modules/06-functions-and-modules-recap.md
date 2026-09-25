---
type: recap
title: "Functions and Modules Recap"
description: "Review of functions and modules concepts"
access: free
---

Functions differ from JavaScript in three ways worth knowing: keyword arguments remove the options-object pattern, a mutable default argument is shared between calls, and decorators are just a function that wraps a function. Generators and `with` are everyday tools in Python that you rarely reach for in JavaScript.

## key points

- No arrow functions. `lambda` is one expression on purpose; anything longer wants a `def`.
- Any parameter can be passed by name, which replaces the options-object pattern.
- A `*` in the signature forces everything after it to be keyword-only. Use it for booleans.
- A mutable default argument is evaluated once and shared. Default to None and build inside.
- Returning several values returns a tuple, which the caller unpacks.
- `*args` is the rest parameter; `**kwargs` has no JavaScript equivalent.
- Assigning to an outer name makes it local, causing UnboundLocalError on the read.
- `@decorator` means `fn = decorator(fn)`, and wrappers should use `functools.wraps`.
- `functools.cache` is a one-line memoize in the standard library.
- `yield` makes a generator: lazy, one value at a time, small in memory.
- `with` guarantees cleanup, which JavaScript has no equivalent for.
- Type hints are unenforced at runtime; mypy or pyright checks them like tsc does.
