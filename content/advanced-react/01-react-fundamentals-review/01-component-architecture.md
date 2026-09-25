---
type: lesson
title: "Component Architecture"
description: "Understanding React component architecture and patterns"
access: free
references:
  - "https://react.dev/learn/thinking-in-react"
  - "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children"
  - "https://react.dev/learn/rendering-lists#why-does-react-need-keys"
---

This chapter is a review. If you already split components confidently, skim it and move to
chapter 2, where the new material starts.

## What a component is for

A component exists to give a name to a piece of interface and the behaviour attached to it. That
is the whole job. Splitting for any other reason usually makes things worse.

Good reasons to split:

- The same markup appears twice.
- A piece has its own state that nothing else cares about.
- The file has grown past what you can hold in your head.
- One part re-renders far more often than the rest.

A bad reason: the file is long. Length alone is not complexity. Three hundred lines describing
one screen, read top to bottom, is easier than eight files you have to jump between.

## Composition beats configuration

When a component grows options, it is usually asking to be composed instead.

```jsx
// Configuration: every new case is another prop, and they interact.
<Card title="Arrays" showFooter footerText="40 min" highlight />

// Composition: the caller assembles what it needs.
<Card>
  <Card.Title>Arrays</Card.Title>
  <Card.Footer>40 min</Card.Footer>
</Card>
```

The first version has to anticipate every use. The second does not: a caller that wants
something new writes it, without touching `Card`. The tell is a boolean prop that only exists to
switch a piece of markup on.

## Passing children is passing a hole

`children` is not just for wrappers. Handing a component the thing to render lets the parent
decide, which often removes a prop entirely.

```jsx
function Panel({ heading, children }) {
  return (
    <section>
      <h2>{heading}</h2>
      {children}
    </section>
  )
}
```

This also happens to help performance, and chapter 3 explains why: content passed as
`children` is created by the parent, so it does not get rebuilt when `Panel` re-renders.

## Prop drilling is only a problem when it is

Passing a prop through two layers is fine. Through six, where the middle four only forward it,
is a smell. The usual fixes, in order of how much they cost:

1. Move the state down, if only the leaf needed it.
2. Pass the rendered element instead of the data, so the middle layers carry nothing.
3. Context, once several distant places genuinely need the same value.

Reaching for context first is the common mistake. It makes the value available everywhere, which
sounds like a benefit until you are trying to work out which component changed.

## A worked example

Here is a lesson list, split the way the rules above suggest. There is no exercise for this
section, so read it and ask what each split buys.

```jsx
// Knows how to fetch and hold state. Renders almost nothing itself.
function LessonListContainer({ courseId }) {
  const [lessons, setLessons] = useState([])
  useEffect(() => {
    let cancelled = false
    fetchLessons(courseId).then(result => {
      if (!cancelled) setLessons(result)
    })
    return () => {
      cancelled = true
    }
  }, [courseId])

  return <LessonList lessons={lessons} />
}

// Knows how to display a list. No fetching, no effects, trivial to test.
function LessonList({ lessons }) {
  const remaining = lessons.filter(lesson => !lesson.done).length

  return (
    <section>
      <ul>
        {lessons.map(lesson => (
          <LessonRow key={lesson.id} lesson={lesson} />
        ))}
      </ul>
      <p>{remaining} left</p>
    </section>
  )
}

// One row. Its own state, because no one else cares whether it is expanded.
function LessonRow({ lesson }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <li>
      <button onClick={() => setExpanded(!expanded)}>{lesson.title}</button>
      {expanded && <p>{lesson.summary}</p>}
    </li>
  )
}
```

Three things worth noticing:

- `remaining` is computed, not stored. It cannot fall out of step with `lessons`.
- `expanded` lives in the row. Putting it in the list would mean the list re-renders whenever
  any row opens, and would need a map of ids to booleans.
- The effect has a cleanup. Without `cancelled`, a response arriving after the id changed would
  overwrite the newer data with older data. That bug is invisible until the network is slow.

The `key` is `lesson.id`, not the array index. Index keys break the moment the list reorders:
React reuses the wrong component and state ends up attached to the wrong row.
