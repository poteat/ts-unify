# ifGuardedReturnToTernary

## Overview

Collapse if-guarded return patterns (where a bare `return` follows the `if`) into a single ternary return.

## Transforms

```ts
// Before
if (condition) {
  return valueA;
}
return valueB;

// After
return condition ? valueA : valueB;
```

```ts
// Before (blockless)
if (condition) return valueA;
return valueB;

// After
return condition ? valueA : valueB;
```

## Captures

- `test` (anonymous) -- the `if` condition.
- `consequent` (anonymous) -- the return value inside the `if` branch.
- `alternate` -- the return value of the trailing return statement.
- `body` -- any preceding statements in the block (spread before the `if`).
