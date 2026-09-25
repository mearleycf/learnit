---
type: recap
title: "State Management Recap"
description: "Review of advanced state management concepts"
---

Reach for a reducer when several values change together, when a transition happens from more than one place, or when you want to test the logic without rendering. A reducer is a pure function of state and action, which is what makes it testable and what makes the purity rules non-negotiable.

## key points

- Several `useState` calls that must change together is the signal to switch to a reducer.
- Model state so illegal combinations cannot be written down, rather than remembering to clear fields.
- Anything computable from existing state should be computed, not stored.
- Keep state in the lowest component that needs it; lift only when something else needs it too.
- A reducer must be pure: no fetching, no randomness, no clock, no outside writes.
- Never mutate the state you were handed. React compares by reference.
- Name actions after what happened, not after the change you want made.
- Return the state unchanged for an unknown or illegal action.
- Because reducers are ordinary functions, they test without React.
