---
type: recap
title: "Performance Optimization Recap"
description: "Review of performance optimization techniques"
---

A component re-renders when its own state changes, its parent re-renders, or a context it reads changes. Memoisation works by referential equality, so the three tools only help when used together. Removing work beats caching it, and measuring beats guessing.

## key points

- Three causes of a re-render: own state, parent rendered, context changed.
- A parent re-rendering re-renders every child, regardless of whether props changed.
- React compares props with `Object.is`, so a fresh object or function is always a new prop.
- `React.memo` on a child receiving a new function every render does nothing but cost a comparison.
- Too few dependencies gives a stale value, which looks like it works; too many makes the memo pointless.
- Moving state down, passing children, and splitting components remove work rather than caching it.
- Do not memoise a filter over a short list, or anything you have not measured.
- `React.memo` is a shallow prop comparison, which is small enough to write yourself.
