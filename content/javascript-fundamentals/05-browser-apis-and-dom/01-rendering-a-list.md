---
type: exercise
title: Rendering a List
description: Build markup from an array and put it in the page, then watch it render
entry: render.js
minutes: 25
difficulty: medium
files:
  - name: data.js
    language: javascript
    readonly: true
  - name: render.js
    language: javascript
---

Render a course outline into the page.

**data.js** (read only) exports `lessons`, an array of `{ title, minutes, done }`.

In **render.js**:

1. Export `totalMinutes(items)`, the sum of every `minutes` value. An empty array gives `0`.
2. Export `remaining(items)`, only the lessons where `done` is false.
3. Export `toListItems(items)`, a single HTML string of one `<li>` per lesson, each reading
   `<li>Title — 20 min</li>`. Use an em dash with a space either side, and nothing between the
   items.
4. Export `render(items)`, which puts that markup inside `#lessons` and writes
   `3 lessons left, 95 minutes total` into `#summary`. Pluralise "lesson" correctly.

Press **Run preview** to watch it render, and **Run checks** to grade it.

## html index.html

```html
<main style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 32rem">
  <h1 style="font-size: 1.25rem">Course outline</h1>
  <ul id="lessons"></ul>
  <p id="summary" style="color: #555"></p>
</main>
```

## file data.js

```javascript
// The lessons to render. You do not need to change this file.

export const lessons = [
  { title: 'Types and Coercion', minutes: 20, done: true },
  { title: 'Splitting a Module', minutes: 25, done: false },
  { title: 'Scope and Hoisting', minutes: 20, done: false },
  { title: 'Rendering a List', minutes: 30, done: false },
]
```

## file render.js

```javascript
import { lessons } from './data.js'

// 1. Every lesson's minutes added together. An empty list is 0.
export function totalMinutes(items) {
  return 0
}

// 2. Only the lessons that are not done.
export function remaining(items) {
  return []
}

// 3. One <li> per lesson: "<li>Types and Coercion — 20 min</li>", joined with nothing.
export function toListItems(items) {
  return ''
}

// 4. Put the list inside #lessons and the summary inside #summary.
export function render(items) {}

render(lessons)
```

## solution

```javascript
import { lessons } from './data.js'

export function totalMinutes(items) {
  return items.reduce((sum, lesson) => sum + lesson.minutes, 0)
}

export function remaining(items) {
  return items.filter(lesson => !lesson.done)
}

export function toListItems(items) {
  return items.map(lesson => `<li>${lesson.title} — ${lesson.minutes} min</li>`).join('')
}

export function render(items) {
  document.querySelector('#lessons').innerHTML = toListItems(items)

  const left = remaining(items).length
  const word = left === 1 ? 'lesson' : 'lessons'
  document.querySelector('#summary').textContent = `${left} ${word} left, ${totalMinutes(items)} minutes total`
}

render(lessons)
```

## explanation

`reduce` needs its initial value. Without the `0`, an empty array throws rather than returning
nothing, which is the one case you were asked to handle.

`map` then `join('')` is the whole trick to building markup from an array. `join()` with no
argument inserts commas, which show up in the page as stray punctuation between every item.

`render` does the two impure things — touching `#lessons` and `#summary` — and nothing else. The
three functions above it are pure, which is why the checks can grade them without a document at
all. That split is worth keeping even when nothing is testing you on it.

## check totalMinutes adds every lesson up

Two lessons of 20 and 35 minutes come to 55, and an empty list to 0.

```javascript
assert.strictEqual(totalMinutes([{ minutes: 20 }, { minutes: 35 }]), 55)
assert.strictEqual(totalMinutes([]), 0)
```

## check remaining keeps only unfinished lessons

A lesson with done: true should be left out.

```javascript
assert.deepStrictEqual(remaining([{ title: 'a', done: true }, { title: 'b', done: false }]), [
  { title: 'b', done: false },
])
```

## check toListItems builds one li per lesson

Each item reads "<li>Title — 20 min</li>" with nothing between them.

```javascript
assert.strictEqual(
  toListItems([{ title: 'Arrays', minutes: 40 }, { title: 'Objects', minutes: 20 }]),
  '<li>Arrays — 40 min</li><li>Objects — 20 min</li>',
)
```

## check toListItems returns nothing for an empty list

No lessons means no markup, not an empty <li>.

```javascript
assert.strictEqual(toListItems([]), '')
```

## check render is exported and callable

render should be a function taking the list of lessons.

```javascript
assert.strictEqual(typeof render, 'function')
```

## hint after 1

```javascript
items.reduce((sum, lesson) => sum + lesson.minutes, 0)
```

## hint after 2

`filter` takes a test that returns true for the items you want to keep.

## hint after 3

```javascript
items.map(lesson => `<li>${lesson.title} — ${lesson.minutes} min</li>`).join('')
```

## hint after 4

In `render`, use `document.querySelector` to find `#lessons` and `#summary`, then set `innerHTML`
and `textContent`.
