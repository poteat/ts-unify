# typeofUndefinedToNullishCheck

## Overview

Replace `typeof x === "undefined"` with the simpler nullish check `x == null`.

## Transforms

```ts
// Before
typeof x === "undefined"

// After
x == null
```

## Captures

- `expr` -- the expression being checked with `typeof`.
