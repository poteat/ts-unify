# StripSeal

## Overview

`StripSeal<T>` removes the `Sealed` brand wrapper from a type. If `T` is
`Sealed<Inner>`, it extracts `Inner`; otherwise it returns `T` unchanged.

## Semantics

```typescript
type Wrapped = Sealed<{ type: "ReturnStatement"; argument: Capture<"arg"> }>;
type Unwrapped = StripSeal<Wrapped>;
// { type: "ReturnStatement"; argument: Capture<"arg"> }

type Plain = { type: "Identifier" };
type Same = StripSeal<Plain>;
// { type: "Identifier" }
```

## Purpose

Used after extraction or substitution when the sealed brand has served its
purpose (e.g., re-keying has been applied) and consumers need the underlying
node shape without the brand intersection.

## Implementation Note

Uses `infer Inner` on the `Sealed<…>` conditional to unwrap the branded type.
