# guardedForPushToFilterMap

## Overview

Transform guarded for-of loops with `push` into `.filter().map()` chains.

## Transforms

```ts
// Before
const result: T = [];
for (const item of items) {
  if (condition(item)) {
    result.push(transform(item));
  }
}

// After
const result = items
  .filter(item => condition(item))
  .map(item => transform(item));
```

## Captures

- `arrayId` -- the identifier for the result array (e.g. `result`).
- `loopVar` -- the loop variable (e.g. `item`).
- `source` -- the iterable being looped over (e.g. `items`).
- `condition` -- the guard condition inside the `if` statement.
- `pushValue` -- the expression pushed onto the array.
- `before` -- any statements before the array declaration (spread).
- `after` -- any statements after the for-of loop (spread).
