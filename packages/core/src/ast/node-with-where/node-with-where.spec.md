# NodeWithWhere

## Overview

`NodeWithWhere<N>` adds a fluent `.where(...constraints)` method that gates a
match on quantified constraints over scoped pattern searches.

Each constraint is a pattern carrying a scope modifier (`.until()`, `.global()`,
`.project()`) and a quantifier terminal (`.none()`, `.some()`, `.atLeast(N)`).
The quantifier determines whether the set of matching nodes passes or fails.

## Scope

- Provider type. Runtime behavior is in `match.spec.md` under "Where".
- `.where()` is a match-time guard (like `.when()`), not an output modifier.
  It goes before `.to()` in the fluent chain.

## Semantics

- `.where(C1, C2, ...)` records a chain entry
  `{ method: "where", args: [C1, C2, ...] }`.
- Each `Ci` is a pattern (builder-produced node) whose chain carries:
  - A scope modifier: `.until(B)` (subtree with boundary, default),
    `.global()` (file), `.project()` (cross-file).
  - A quantifier: `.none()`, `.some()`, `.atLeast(N)`, etc.
- Multiple `.where()` calls compose: all must pass.
- `.where()` does not alter the capture bag.

## Examples

```ts
// Reject if subtree contains ThisExpression (stopping at fn boundaries).
.where(
  U.ThisExpression().until(fnBoundary).none(),
)

// Reject if no call site exists in the project.
.where(
  U.CallExpression({ callee: $.ref("id") }).project().some(),
)
```
