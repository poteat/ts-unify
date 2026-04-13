# NodeWithAtMost

## Overview

`NodeWithAtMost<N>` adds a fluent `.atMost(n)` quantifier terminal to
builder-returned nodes. It marks a pattern as "reject if more than n
matches are found" when used inside a `.where()` constraint.

## Scope

- Provider type. Runtime behavior is in `match.spec.md` under "Where".
- `.atMost(n)` is only meaningful when the pattern is passed to `.where()`.

## Semantics

- `.atMost(n)` records a chain entry `{ method: "atMost", args: [n] }`.
- At match time, the engine searches the scoped set for the pattern.
  If the number of matching nodes exceeds `n`, the overall rule match
  is rejected.
- `.atMost(n)` is a natural terminal — chaining `.to()` after
  `.atMost(n)` is a no-op.
