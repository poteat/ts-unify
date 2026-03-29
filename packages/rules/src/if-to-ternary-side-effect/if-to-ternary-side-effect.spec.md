# ifToTernarySideEffect

## Overview

Convert an if/else where both branches are side-effect expression statements into a single ternary expression statement.

## Transforms

```ts
// Before
if (cond) {
  expr1;
} else {
  expr2;
}

// After
cond ? expr1 : expr2;
```

```ts
// Before (blockless)
if (cond) expr1; else expr2;

// After
cond ? expr1 : expr2;
```

## Captures

- `test` (anonymous) -- the `if` condition.
- `consequent` (anonymous) -- the expression in the `if` branch.
- `alternate` (anonymous) -- the expression in the `else` branch.
