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

## Notes

- This rule adds an import: `{ uniq }` from `"my-utils/uniq"`.
