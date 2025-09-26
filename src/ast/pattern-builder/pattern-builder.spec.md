# PatternBuilder

## Overview

`PatternBuilder<K>` constructs typed AST values for a node kind `K`.

- Discriminant call `()` yields the minimal value `{ type: … }` for “any K”.
- Build call `(shape)` constructs a concrete node (no capture tokens) matching
  `NodeByKind[K]` minus internal ESTree fields.
- Pattern call `(pattern)` accepts a `Pattern<NodeByKind[K]>` and binds capture
  tokens to the precise positions/types from the node kind.

This provider is agnostic to downstream fluent helpers; composition is outside
its scope. Implementations may return a fluent‑capable value, but that is not a
contract of this provider.

## Design

- Three overloads keep the surface minimal and predictable:
  - Discriminant `()` — `{ type: AST_NODE_TYPES[K] }` only.
  - Build `(shape)` — concrete node with the kind’s fields; no capture tokens.
  - Pattern `(pattern)` — capturable shape that binds names/types against
    `NodeByKind[K]`.
- `BindCaptures` aligns explicit/implicit capture tokens with the node kind so
  extracted capture bags reflect the actual AST shape.
- Internal ESTree fields (`parent`, `loc`, `range`) are excluded from input and
  output shapes.

## Examples

```ts
// Discriminant — match any BlockStatement
const anyBlock = U.BlockStatement();

// Build — construct a concrete Identifier node
const id = U.Identifier({ name: "x" });

// Pattern — capture the argument of a ReturnStatement
const ret = U.ReturnStatement({ argument: $("arg") });
```
