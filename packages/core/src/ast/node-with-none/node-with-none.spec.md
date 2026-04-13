# NodeWithNone

## Overview

`NodeWithNone<N>` adds a fluent `.none()` quantifier terminal to
builder-returned nodes. It marks a pattern as "reject if any match is found"
when used inside a `.where()` constraint.

## Scope

- Provider type. Runtime behavior is in `match.spec.md` under "Where".
- `.none()` is only meaningful when the pattern is passed to `.where()`.

## Semantics

- `.none()` records a chain entry `{ method: "none", args: [] }`.
- At match time, the engine searches the scoped set for the pattern.
  If any node matches, the overall rule match is rejected.
- `.none()` is a natural terminal — an empty result set has nothing
  to transform, so chaining `.to()` after `.none()` is a no-op.
