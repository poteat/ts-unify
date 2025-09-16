# PatternBuilder

## Overview

`PatternBuilder<K>` is the type of a builder function for a node of kind `K`.
It supports two forms: nullary and parameterized.

## Semantics

- `()` → returns just the discriminant `{ type: … }` for kind `K`.
- `(pattern)` → returns `{ type: … }` intersected with capture bindings derived
  from the provided `Pattern<NodeByKind[K]>` via `BindCaptures`.

## Design Notes

- The nullary form is intentionally shallow (discriminant only) to avoid deep
  type instantiation and recursive traversal in utilities like
  `ExtractCaptures`.
- The parameterized form excludes internal fields (`type`, `parent`, `loc`,
  `range`) from the bound shape to produce stable, consumer-facing results.

## Example

```ts
// Nullary: any BlockStatement
const a = U.BlockStatement(); // { type: 'BlockStatement' }

// Parameterized: capture the test of an IfStatement
const b = U.IfStatement({ test: $ });
```
