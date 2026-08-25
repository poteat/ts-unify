# atoms

## Overview

A vocabulary declared at once: a table of unnamed slots, each coming out
named by its key.

## Usage

```typescript
export const Run = atoms({
  RepoRoot: atom<string>(),
  CacheDir: atom<string>(),
  Clock: atom<{ readonly now: number }>(),
})

Run.CacheDir // Atom<string, 'CacheDir'>
const { Clock } = Run // Atom<{ readonly now: number }, 'Clock'>
```

## Semantics

- `atoms<const T extends Deps>(table: T): Named<T>`, with `Named<T>` the
  table's keys each mapped to `Atom<ValueOf<T[K]>, K>`: the key is the
  name, so two entries over one value type are two types, and `Missing`
  and `Unfilled` print the key. Destructuring keeps the type.
- The key is the slot's label too: error text says `CacheDir is not
  filled (read by Clock)`.
- Each entry is a fresh slot with its own symbol; the ones written in the
  table are not the ones returned. An entry is written inline, as a bare
  `atom<Value>()`, and never held elsewhere; an entry that has a name or a
  label already is renamed by its key.
- `atom<A>()` with a full alias stays the form for a single slot.
