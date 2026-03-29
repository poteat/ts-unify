# arrayFromMapToArrayFrom

## Overview

Collapse `Array.from(x).map(fn)` into `Array.from(x, fn)`.

## Transforms

```ts
// Before
Array.from(iterable).map(mapFn)

// After
Array.from(iterable, mapFn)
```

## Captures

- `iterable` -- the iterable passed to `Array.from`.
- `mapFn` -- the mapping function passed to `.map()`.
