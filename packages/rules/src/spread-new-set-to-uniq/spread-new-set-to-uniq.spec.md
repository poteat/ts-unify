# spreadNewSetToUniq

## Overview

Replace `[...new Set(array)]` with `uniq(array)`.

## Transforms

```ts
// Before
[...new Set(myArray)]

// After
uniq(myArray)
```

## Captures

- `array` -- the array passed to `new Set()`.

## Configuration

- `from` (default: `"lodash/uniq"`) -- the module path to import `uniq` from.

## Imports

- `{ uniq }` from the configured `from` path.
