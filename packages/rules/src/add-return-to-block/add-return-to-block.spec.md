# addReturnToBlock

## Overview

Transform function body blocks with a single expression statement into blocks that return that expression.

## Transforms

```ts
// Before
function foo() { someFunction(); }

// After
function foo() { return someFunction(); }
```

## Captures

- `expression` -- the single expression statement inside the function body block.
