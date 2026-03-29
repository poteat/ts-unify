# normalizeTernaryOrder

## Overview

Normalize ternary expressions so the condition is positive (removes leading `!` or flips `!==`/`!=` to `===`/`==`), swapping the branches accordingly.

## Transforms

```ts
// Before
!condition ? consequent : alternate

// After
condition ? alternate : consequent
```

```ts
// Before
x !== y ? consequent : alternate

// After
x === y ? alternate : consequent
```

```ts
// Before
x != y ? consequent : alternate

// After
x == y ? alternate : consequent
```

## Captures

- `condition` -- the inner expression of a `!` unary test (first variant).
- `test` / `operator` / `left` / `right` -- components of the binary expression test (second variant).
- `consequent` -- the original consequent (becomes the alternate in output).
- `alternate` -- the original alternate (becomes the consequent in output).
