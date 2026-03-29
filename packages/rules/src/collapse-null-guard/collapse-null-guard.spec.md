# collapseNullGuard

## Overview

Collapse a null guard with early return into nullish coalescing (`??`).

## Transforms

```ts
// Before
if (value === null) return def;
return value;

// After
return value ?? def;
```

```ts
// Before
if (value === null) return def;
return value as T;

// After
return (value ?? def) as T;
```

## Captures

- `value` -- the expression being null-checked and returned.
- `fallback` -- the fallback value returned when `value` is null.
- `typeAnnotation` -- (optional) the `as T` type assertion on the return.
- `body` -- any preceding statements in the block (spread before the null check).

## Notes

- Precondition: `value` must have type `T | null` where `T` never includes `undefined`. The `??` operator checks for both `null` and `undefined`, so this transform is only safe when `undefined` is not a valid value of `T`.
