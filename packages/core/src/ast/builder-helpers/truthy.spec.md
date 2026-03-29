# truthy

## Overview

`truthy` is a generic value/type guard placed on the builder namespace (`U`). It
narrows a value `T` to `Exclude<T, Falsy>` where `Falsy` is
`false | 0 | 0n | "" | null | undefined`.

## Semantics

- Accepts any value `T` and returns `x is Exclude<T, Falsy>`.
- Works with `.when` single‑capture guards to refine captured values (e.g., from
  `Expression | null` to `Expression`).
- `NaN` is not representable at the type level and is not excluded by the
  guard’s type.

## Examples

```ts
type T = string | 0 | null | undefined;
// Using the guard narrows T → string
const g: U["truthy"] = (v): v is Exclude<T, Falsy> => Boolean(v);
```
