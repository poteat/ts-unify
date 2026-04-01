# CoalesceUnionOfBags

## Overview

`CoalesceUnionOfBags<U>` merges a union of capture bags into a single object
type whose keys are the union of all constituent keys. For each key `K`, the
value type is the union of `U[K]` across every member of `U` that contains `K`,
combined with `never` for members that lack it.

## Semantics

Given a union `{ a: number } | { a: string; b: boolean }`:

- Key `a` appears in both members, so its value becomes `number | string`.
- Key `b` appears only in the second member; the first member contributes
  `never`, so the value is `boolean | never` which simplifies to `boolean`.

```typescript
type Bags = { a: number } | { a: string; b: boolean };
type Coalesced = CoalesceUnionOfBags<Bags>;
// { a: number | string; b: boolean }
```

## Purpose

Used during capture extraction from OR branches. Each branch may produce a
different bag shape; coalescing unifies them into a single bag before re-keying
or merging with sibling properties.

## Implementation Note

Uses `KeysOfUnion<U>` to collect all keys across the union, then a distributive
conditional to extract values per member.
