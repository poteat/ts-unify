# NodeWithExactly

## Overview

`NodeWithExactly<N>` adds a fluent `.exactly(n)` quantifier terminal to
builder-returned nodes. It marks a pattern as "reject unless exactly n
matches are found" when used inside a `.where()` constraint.

## Scope

- Provider type. Runtime behavior is in `match.spec.md` under "Where".
- `.exactly(n)` is only meaningful when the pattern is passed to `.where()`.

## Semantics

- `.exactly(n)` records a chain entry `{ method: "exactly", args: [n] }`.
- At match time, the engine searches the scoped set for the pattern.
  If the number of matching nodes is not equal to `n`, the overall rule
  match is rejected.
- `.exactly(n)` is a natural terminal — chaining `.to()` after
  `.exactly(n)` is a no-op.
