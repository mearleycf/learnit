---
type: exercise
title: "State Synchronization"
description: "Managing state across components"
entry: "sync.js"
minutes: 20
difficulty: medium
number: 3
files:
  - name: "sync.js"
    language: javascript
---

Reconcile local edits with what the server says.

An offline-capable app has two versions of the truth: what the student changed locally and what
came back from the server. Merging them is the awkward part, and it is pure logic.

Each record is `{ id, updatedAt, ...fields }`. In **sync.js**, export:

1. `merge(local, remote)` returning one array. For an id in both, keep whichever has the later
   `updatedAt`; on an exact tie keep the local one, because the student is looking at it.
   Records in only one side are kept as they are. Sort the result by `id`.
2. `conflicts(local, remote)` returning the ids present in both where `updatedAt` differs,
   sorted. These are the ones worth telling someone about.
3. `pending(local, remote)` returning the local records that are newer than their remote
   counterpart, or absent from remote entirely. These still need uploading. Sort by `id`.

## file sync.js

```javascript
// 1. One array, newest per id wins, local wins an exact tie. Sorted by id.
export function merge(local, remote) {}

// 2. Ids in both sides whose updatedAt differs. Sorted.
export function conflicts(local, remote) {}

// 3. Local records newer than remote, or missing from it. Sorted by id.
export function pending(local, remote) {}
```

## solution

```javascript
const index = records => new Map(records.map(record => [record.id, record]))
const byId = (a, b) => a.id.localeCompare(b.id)

export function merge(local, remote) {
  const merged = index(remote)

  for (const record of local) {
    const other = merged.get(record.id)
    // >= because an exact tie goes to local.
    if (!other || record.updatedAt >= other.updatedAt) merged.set(record.id, record)
  }

  return [...merged.values()].toSorted(byId)
}

export function conflicts(local, remote) {
  const remoteById = index(remote)

  return local
    .filter(record => {
      const other = remoteById.get(record.id)
      return other !== undefined && other.updatedAt !== record.updatedAt
    })
    .map(record => record.id)
    .toSorted()
}

export function pending(local, remote) {
  const remoteById = index(remote)

  return local
    .filter(record => {
      const other = remoteById.get(record.id)
      return other === undefined || record.updatedAt > other.updatedAt
    })
    .toSorted(byId)
}
```

## explanation

Indexing remote by id turns every lookup into one operation instead of a scan, which is the whole trick in all three functions. merge starts from remote and lets local overwrite on `>=`, so the tie rule falls out of the comparison rather than needing a special case. conflicts uses `!==` rather than comparing magnitudes, because either side being ahead is still a disagreement. pending uses a strict `>`, since equal timestamps mean there is nothing to send.

## check merge keeps the newer of two versions

The higher updatedAt wins.

```javascript
assert.deepStrictEqual(merge([{id:'a',updatedAt:2,v:'new'}], [{id:'a',updatedAt:1,v:'old'}]), [{id:'a',updatedAt:2,v:'new'}])
```

## check merge prefers local on an exact tie

Equal timestamps mean the version in front of the student wins.

```javascript
assert.strictEqual(merge([{id:'a',updatedAt:1,v:'local'}], [{id:'a',updatedAt:1,v:'remote'}])[0].v, 'local')
```

## check merge keeps records that exist on one side only

Nothing is dropped just because the other side has not seen it.

```javascript
assert.deepStrictEqual(merge([{id:'a',updatedAt:1}], [{id:'b',updatedAt:1}]).map(r => r.id), ['a','b'])
```

## check merge sorts by id

Output order does not depend on input order.

```javascript
assert.deepStrictEqual(merge([{id:'z',updatedAt:1}], [{id:'a',updatedAt:1}]).map(r => r.id), ['a','z'])
```

## check merge handles two empty sides

Nothing in, empty array out.

```javascript
assert.deepStrictEqual(merge([], []), [])
```

## check conflicts finds ids that differ on both sides

Present in both with different timestamps.

```javascript
assert.deepStrictEqual(conflicts([{id:'a',updatedAt:2},{id:'b',updatedAt:1}], [{id:'a',updatedAt:1},{id:'b',updatedAt:1}]), ['a'])
```

## check conflicts ignores records on one side only

A record the other side has never seen is not a conflict.

```javascript
assert.deepStrictEqual(conflicts([{id:'a',updatedAt:1}], [{id:'b',updatedAt:9}]), [])
```

## check pending finds local records newer than remote

These still need uploading.

```javascript
assert.deepStrictEqual(pending([{id:'a',updatedAt:2}], [{id:'a',updatedAt:1}]).map(r => r.id), ['a'])
```

## check pending includes local records remote has never seen

A brand new local record counts as pending.

```javascript
assert.deepStrictEqual(pending([{id:'new',updatedAt:1}], []).map(r => r.id), ['new'])
```

## check pending excludes records the remote already has at the same time

Nothing to upload when both sides agree.

```javascript
assert.deepStrictEqual(pending([{id:'a',updatedAt:1}], [{id:'a',updatedAt:1}]), [])
```

## hint after 1

```javascript
const byId = new Map(remote.map(r => [r.id, r]))
```

## hint after 2

For merge, start from a Map of remote, then overwrite with any local record that is newer or equal.

## hint after 3

```javascript
[...map.values()].toSorted((a, b) => a.id.localeCompare(b.id))
```

## hint after 4

pending is local filtered by: no remote counterpart, or a strictly greater updatedAt.
