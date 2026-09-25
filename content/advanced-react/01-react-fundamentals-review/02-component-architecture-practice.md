---
type: exercise
title: "Component Architecture Practice"
description: "Practice implementing React component patterns"
access: free
entry: "LessonList.jsx"
minutes: 30
difficulty: medium
files:
  - name: "data.js"
    language: javascript
    readonly: true
  - name: "LessonList.jsx"
    language: jsx
---

Build the lesson list the chapter's worked example sketched.

Checks call `render(Component, props)`, which returns the component's markup as a string, so
you are writing real components and asserting on real output.

**data.js** (read only) exports `LESSONS`.

In **LessonList.jsx**, export three components:

1. `Badge({ done })` renders `<span class="badge done">Done</span>` when `done` is true, and
   `<span class="badge">To do</span>` otherwise.
2. `LessonRow({ lesson })` renders an `<li>` containing the title, the minutes as
   `"40 min"`, and a `Badge`. Give the `<li>` `className="row"`.
3. `LessonList({ lessons })` renders a `<ul className="lessons">` of one `LessonRow` per
   lesson, then a `<p className="summary">` reading `"2 of 4 done"`. Remember the `key`.

Note what changes and what does not: this is ordinary React, and the only thing the runner adds
is that `render` returns a string rather than mounting anything.

## file data.js

```javascript
// The lessons to render. You do not need to change this file.

export const LESSONS = [
  { title: 'Variables', minutes: 20, done: true },
  { title: 'Functions', minutes: 35, done: true },
  { title: 'Arrays', minutes: 40, done: false },
  { title: 'Objects', minutes: 25, done: false },
]
```

## file LessonList.jsx

```jsx
import { LESSONS } from './data.js'

// 1. <span class="badge done">Done</span> or <span class="badge">To do</span>
export function Badge({ done }) {
  return null
}

// 2. An <li className="row"> with the title, "40 min", and a Badge.
export function LessonRow({ lesson }) {
  return null
}

// 3. A <ul className="lessons"> of rows, then <p className="summary">2 of 4 done</p>
export function LessonList({ lessons }) {
  return null
}
```

## solution

```jsx
import { LESSONS } from './data.js'

export function Badge({ done }) {
  return <span className={done ? 'badge done' : 'badge'}>{done ? 'Done' : 'To do'}</span>
}

export function LessonRow({ lesson }) {
  return (
    <li className="row">
      {lesson.title} {lesson.minutes} min <Badge done={lesson.done} />
    </li>
  )
}

export function LessonList({ lessons }) {
  const done = lessons.filter(lesson => lesson.done).length

  return (
    <>
      <ul className="lessons">
        {lessons.map(lesson => (
          <LessonRow key={lesson.title} lesson={lesson} />
        ))}
      </ul>
      <p className="summary">
        {done} of {lessons.length} done
      </p>
    </>
  )
}
```

## explanation

Badge owns the whole decision about how a status looks, so LessonRow composes it rather than repeating the markup. The done count is derived with filter at render time, not stored, so it cannot fall out of step with the list. The key is the title rather than the array index, for the reason the lesson gave: an index key attaches state to the wrong row once the list reorders. The fragment lets LessonList return two siblings without a wrapper element nobody asked for.

## check Badge shows Done for a finished lesson

Both the badge class and the done modifier.

```jsx
const html = render(Badge, { done: true }); assert.match(html, /class="badge done"/); assert.match(html, /Done/)
```

## check Badge shows To do otherwise

No done modifier on the class.

```jsx
const html = render(Badge, { done: false }); assert.match(html, /class="badge"/); assert.match(html, /To do/)
```

## check LessonRow renders an li with the title

An <li> element carrying the lesson title.

```jsx
const html = render(LessonRow, { lesson: { title: 'Arrays', minutes: 40, done: false } }); assert.match(html, /^<li/); assert.match(html, /Arrays/)
```

## check LessonRow shows the duration

Minutes rendered as "40 min".

```jsx
const html = render(LessonRow, { lesson: { title: 'Arrays', minutes: 40, done: false } }); assert.match(html, /40 min/)
```

## check LessonRow includes the Badge

Composing a component inside another, not repeating its markup.

```jsx
const html = render(LessonRow, { lesson: { title: 'Arrays', minutes: 40, done: true } }); assert.match(html, /class="badge done"/)
```

## check LessonRow gives the li a class

className="row" on the list item.

```jsx
const html = render(LessonRow, { lesson: { title: 'A', minutes: 1, done: false } }); assert.match(html, /class="row"/)
```

## check LessonList renders one row per lesson

Four lessons, four list items.

```jsx
const sample = [{title:'A',minutes:1,done:true},{title:'B',minutes:2,done:true},{title:'C',minutes:3,done:false},{title:'D',minutes:4,done:false}]; const html = render(LessonList, { lessons: sample }); assert.strictEqual((html.match(/<li/g) || []).length, 4)
```

## check LessonList wraps the rows in a ul

A <ul className="lessons"> around them.

```jsx
const sample = [{title:'A',minutes:1,done:true},{title:'B',minutes:2,done:true},{title:'C',minutes:3,done:false},{title:'D',minutes:4,done:false}]; const html = render(LessonList, { lessons: sample }); assert.match(html, /<ul class="lessons"/)
```

## check LessonList summarises how many are done

Two of the four seeded lessons are finished.

```jsx
const sample = [{title:'A',minutes:1,done:true},{title:'B',minutes:2,done:true},{title:'C',minutes:3,done:false},{title:'D',minutes:4,done:false}]; const html = render(LessonList, { lessons: sample }); assert.match(html, /class="summary"[^>]*>2 of 4 done</)
```

## check LessonList handles an empty list

No rows, and a summary reading 0 of 0.

```jsx
const html = render(LessonList, { lessons: [] }); assert.strictEqual((html.match(/<li/g) || []).length, 0); assert.match(html, /0 of 0 done/)
```

## hint after 1

```jsx
return <span className={done ? "badge done" : "badge"}>{done ? "Done" : "To do"}</span>
```

## hint after 2

LessonRow renders <Badge done={lesson.done} /> rather than repeating the span itself.

## hint after 3

```jsx
lessons.map(lesson => <LessonRow key={lesson.title} lesson={lesson} />)
```

## hint after 4

The done count is derived with filter, not stored. A fragment lets you return the ul and the p together.
