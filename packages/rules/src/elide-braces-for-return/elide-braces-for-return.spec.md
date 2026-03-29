# elideBracesForReturn

## Overview

Elide braces for arrow functions that return a single expression.

## Transforms

```ts
// Before
(x) => { return x + 1; }

// After
(x) => x + 1
```

## Captures

- `$` (anonymous) -- the return argument expression inside the block body.
