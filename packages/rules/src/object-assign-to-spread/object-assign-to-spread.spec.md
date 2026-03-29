# objectAssignToSpread

## Overview

Replace `Object.assign({}, a, b)` with object spread syntax `{ ...a, ...b }`.

## Transforms

```ts
// Before
Object.assign({}, a, b)

// After
{ ...a, ...b }
```

## Captures

- `sources` -- the rest arguments after the empty object literal (spread as `SpreadElement` entries in the output).
