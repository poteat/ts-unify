# Dollar Object Spread

Type-level brand that enables `{ ...$ }` usage in object patterns to concisely
capture properties by name.

## Overview

- When an object pattern includes the dollar value spread (`{ ...$ }`), the
  consumer may interpret this as: capture every property in the target shape by
  its property name, unless the property is explicitly present in the pattern
  with its own subpattern.
- This module provides the brand type used to mark such object patterns.

## Semantics (as used by BindCaptures)

- Given a shape `S` and a pattern `P & DollarObjectSpread`:
  - For each `K in keyof S`:
    - If `K` is present in `P`, bind using `P[K]`.
    - Otherwise, produce `Capture<K, S[K]>`.
- `{ ...$ }` alone captures every top-level property by name.

## Runtime

- `$` has no enumerable properties. Spreading it into an object literal is a
  runtime no-op; the brand exists only for type-level interpretation.

## Examples

```ts
type Shape = { id: number; name: string };
// Pattern that captures both keys by name:
type P1 = {} & DollarObjectSpread;
// Pattern that captures 'name' by subpattern and 'id' via spread-$:
type P2 = { name: $ } & DollarObjectSpread;
```
