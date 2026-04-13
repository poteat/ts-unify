# NodeWithSome

## Overview

`NodeWithSome<N>` adds a fluent `.some()` quantifier terminal to
builder-returned nodes. It marks a pattern as "reject if zero matches are
found" when used inside a `.where()` constraint.

## Scope

- Provider type. Runtime behavior is in `match.spec.md` under "Where".
- `.some()` is only meaningful when the pattern is passed to `.where()`.

## Semantics

- `.some()` records a chain entry `{ method: "some", args: [] }`.
- At match time, the engine searches the scoped set for the pattern.
  If no node matches, the overall rule match is rejected.
- `.some()` is a natural terminal — chaining `.to()` after `.some()`
  is a no-op.
