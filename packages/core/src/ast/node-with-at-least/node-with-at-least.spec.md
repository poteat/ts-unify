# NodeWithAtLeast

## Overview

`NodeWithAtLeast<N>` adds a fluent `.atLeast(n)` quantifier terminal to
builder-returned nodes. It marks a pattern as "reject if fewer than n
matches are found" when used inside a `.where()` constraint.

## Scope

- Provider type. Runtime behavior is in `match.spec.md` under "Where".
- `.atLeast(n)` is only meaningful when the pattern is passed to `.where()`.

## Semantics

- `.atLeast(n)` records a chain entry `{ method: "atLeast", args: [n] }`.
- At match time, the engine searches the scoped set for the pattern.
  If the number of matching nodes is less than `n`, the overall rule
  match is rejected.
- `.atLeast(n)` is a natural terminal — chaining `.to()` after
  `.atLeast(n)` is a no-op.
