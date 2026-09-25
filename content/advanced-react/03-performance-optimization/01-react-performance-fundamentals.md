---
type: lesson
title: "React Performance Fundamentals"
description: "Understanding React performance and optimization techniques"
references:
  - "https://react.dev/reference/react/useMemo#should-you-add-usememo-everywhere"
  - "https://react.dev/reference/react/memo"
  - "https://react.dev/learn/render-and-commit"
---

Most React performance work is wasted, because most of it is done without measuring. This
section is about knowing which work is worth doing.

## Why a component re-renders

Three reasons, and only three:

1. Its own state changed.
2. Its parent re-rendered.
3. A context it reads changed.

Number two catches people out. **A parent re-rendering re-renders every child**, whether or not
their props changed. That is usually fine: rendering is calling a function and comparing the
result. It becomes a problem when the tree is deep or a child is genuinely expensive.

## Referential equality is the whole game

React compares props with `Object.is`. For a string or a number that does what you expect. For
an object, an array or a function, it compares identity, not contents.

```javascript
{ a: 1 } === { a: 1 }   // false
[] === []               // false
(() => {}) === (() => {}) // false
```

Which means this child sees a new prop on every single render:

```jsx
<LessonList options={{ sort: 'title' }} onSelect={() => choose(id)} />
```

Both the object and the function are built fresh each time the parent runs. Nothing about them
changed, but they are not the same values, so any memoisation on `LessonList` is defeated.

## The three tools

`useMemo` keeps a computed value between renders. `useCallback` keeps a function. `React.memo`
skips a child's render when its props are unchanged by that same comparison.

```jsx
const sorted = useMemo(() => lessons.toSorted(byTitle), [lessons])
const handleSelect = useCallback(id => choose(id), [choose])
const LessonList = React.memo(function LessonList({ lessons }) { /* ... */ })
```

They work together or not at all. `React.memo` on a child that receives a fresh function every
render does nothing except add a comparison. That is the most common way this goes wrong: one of
the three applied, the other two forgotten, and the result is slower than doing nothing.

## The dependency array

The array says when to recompute. Get it wrong in either direction and you get a bug:

- **Too few dependencies** and you keep a stale value, closing over an old variable. This is the
  dangerous one, because it looks like it works.
- **Too many** and it recomputes every render, so the memo is pure overhead.

The eslint rule that checks this is worth having on. When you find yourself arguing with it, the
answer is almost always that the function should not have been defined there.

## When not to bother

Memoising is not free. It costs a comparison on every render, it holds the old value in memory,
and it makes the code harder to read.

Skip it when:

- The calculation is a `filter` or a `map` over a list you can see the end of.
- The component renders rarely.
- You have not measured.

That last one carries the others. Open the profiler, find what is actually slow, fix that. A
codebase covered in `useMemo` written by someone who never profiled is slower and harder to
change than one with none.

## Cheaper things to try first

Before reaching for memoisation:

- **Move state down.** If only one subtree cares, put the state there and the rest stops
  re-rendering.
- **Pass elements as children.** Content created by the parent is not rebuilt when the wrapper
  re-renders.
- **Split the component.** A frequently changing piece in its own component limits the damage.

Each of these removes work rather than caching it, which is always the better trade.

## What React.memo actually does

It is a shallow comparison of the previous props against the next ones. Same keys, and each
value equal by `Object.is`. Nothing deeper.

That is a small enough idea to write yourself, and the exercise in this chapter does exactly
that, along with the two caching helpers underneath `useMemo`.
