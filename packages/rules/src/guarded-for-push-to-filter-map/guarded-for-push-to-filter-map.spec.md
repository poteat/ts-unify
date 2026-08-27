# guardedForPushToFilterMap

## Overview

Transform guarded for-of loops with `push` into `.filter().map()` chains.
Two rules read the two spellings of the guard: `guardedForPushToFilterMap`
an `if` around the push, `skippedForPushToFilterMap` a `continue` before
it. Both drop the array's annotation, since the chain's type is the
callback's.

## Transforms

```ts
// Before
const result: T[] = [];
for (const item of items) {
  if (condition(item)) {
    const step = prepare(item);
    result.push(transform(step));
  }
}

// After
const result = items
  .filter(item => condition(item))
  .map(item => {
    const step = prepare(item);
    return transform(step);
  });

// Before
const result: T[] = [];
for (const item of items) {
  if (!condition(item)) continue;
  result.push(transform(item));
}

// After
const result = items
  .filter(item => condition(item))
  .map(item => transform(item));
```

## Captures

- `arrayName` -- the result array's name (e.g. `result`), unified between
  the declaration and the push, so an annotated `const result: T[] = []`
  matches.
- `loopVar` -- the loop variable (e.g. `item`).
- `source` -- the iterable being looped over (e.g. `items`).
- `condition` -- the guard condition inside the `if` statement (guarded).
- `skipped` -- the `continue`'s test (skipped); the filter keeps `!skipped`,
  or `p` when the test was `!p`.
- `consts` -- the `const` declarations between the guard and the push,
  kept in the map's callback before its `return`; a body with any other
  statement there is not matched (`.when`).
- `pushValue` -- the expression pushed onto the array.
- `before` -- any statements before the array declaration (spread).
- `after` -- any statements after the for-of loop (spread).
