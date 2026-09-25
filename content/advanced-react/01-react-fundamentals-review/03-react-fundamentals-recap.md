---
type: recap
title: "React Fundamentals Recap"
description: "Review of core React concepts"
access: free
---

Components name a piece of interface and the behaviour attached to it. Split when markup repeats, when a piece owns state nothing else needs, or when one part re-renders far more than the rest. Compose rather than adding options, and keep state as low as it will go.

## key points

- Split for repetition, local state or differing render frequency, not for file length.
- A boolean prop that only switches markup on is a sign the component wants composing.
- Passing `children` hands the decision to the parent and often removes a prop.
- Prop drilling through two layers is fine; through six forwarding-only layers is not.
- Try moving state down or passing an element before reaching for context.
- Compute what you can derive; do not store it alongside its source.
- Keep an effect cancellable, or a slow response can overwrite newer data.
- Use a stable id as `key`, never the array index, or state attaches to the wrong row.
