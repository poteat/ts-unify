# StripOr

## Overview

`StripOr<T>` removes the `OR_BRAND` field from a type if it is present,
yielding the underlying value type without the disjunction brand. If `T` does
not carry the brand, it is returned unchanged.

## Semantics

```typescript
type Branded = { a: number; readonly [OR_BRAND]: true };
type Plain = StripOr<Branded>;
// { a: number }

type NoBrand = { a: number };
type Same = StripOr<NoBrand>;
// { a: number }
```

## Purpose

After resolving an `or(...)` disjunction during extraction or substitution, the
internal `OR_BRAND` marker is no longer needed. `StripOr` strips it so
downstream types see a clean object shape.

## Implementation Note

Uses a conditional check against `{ readonly [OR_BRAND]: true }` and `Omit` to
remove the brand key.
