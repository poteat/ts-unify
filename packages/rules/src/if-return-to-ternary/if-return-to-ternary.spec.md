# ifReturnToTernary

## Overview

Convert an if/else where both branches return into a single return with a ternary expression.

## Transforms

```ts
// Before
if (cond) {
  return expr1;
} else {
  return expr2;
}

// After
return cond ? expr1 : expr2;
```

```ts
// Before (blockless)
if (cond) return expr1;
else return expr2;

// After
return cond ? expr1 : expr2;
```

## Captures

- `test` (anonymous) -- the `if` condition.
- `consequent` (anonymous) -- the return value of the `if` branch.
- `alternate` (anonymous) -- the return value of the `else` branch.
