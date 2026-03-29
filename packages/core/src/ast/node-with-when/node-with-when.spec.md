# NodeWithWhen

## Overview

`NodeWithWhen` adds a fluent `.when` method to builder‑returned nodes so you can
attach constraints where you define the pattern. If a `.when` condition fails,
the structure does not match. If a `.when` is a type guard, it also narrows the
types of captured values everywhere they appear in the node.

The capture bag (names and value types) is derived from the node itself; you do
not pass it around manually.

## How It Works

- Single‑capture callbacks (node has exactly one capture):
  - `(value) => boolean` — checks a condition; no type change.
  - `(value): value is Narrow` — narrows that capture’s value type.
- Bag callbacks (multiple captures):
  - `(bag) => boolean` — checks a condition; no type change.
  - `(bag): bag is Narrow` — narrows each named capture in the node.
- Narrowing updates embedded capture tokens; spread captures refine their
  element types when the bag entry is a readonly array.
- Chaining: each guard’s narrowing feeds into the next `.when`.
- Failure: a `false` result excludes the node from matching.
- Abstraction boundaries: single‑capture narrowing inside helper subtrees is
  local to that subtree. To propagate the narrowed single capture to the parent
  property name when embedding, use `.seal()` (see `NodeWithSeal`).

## Examples

```ts
// Single capture — value‑only callback
const r = U.ReturnStatement({ argument: $("arg") })
  .when((arg) => arg != null) // predicate (no narrowing)
  .when((arg): arg is string => true); // guard (narrows arg to string)

// Multiple captures — bag callback
const i = U.IfStatement({
  test: $("t"),
  consequent: $("c"),
  alternate: $("a"),
}).when(({ a }) => a != null); // predicate (no narrowing)
```

## Scope

Provider type used by builder‑returned nodes. Defines `.when` typing and
narrowing behavior; it does not perform runtime matching.
