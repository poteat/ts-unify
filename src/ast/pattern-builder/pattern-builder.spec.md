# PatternBuilder

## Overview

`PatternBuilder<K>` creates typed AST patterns for a node kind `K`.

- Call with no args to get the discriminant only — “any `K`”.
- Call with a `Pattern<NodeByKind[K]>` to build a typed pattern with capture
  positions bound to the node’s shape.
- Returned nodes support fluent constraints via `.when` (see `NodeWithWhen`).

## Why two forms?

- Nullary keeps things lightweight when you only need the `type` tag.
- Parameterized binds capture tokens (`$`/`Capture`/`Spread`) against the
  concrete AST shape, so downstream tools see precise capture value types.

## Using `.when`

Builders return `NodeWithWhen`, which adds a fluent `.when` method:

- Single-capture patterns can accept the value directly: `(v) => …`.
- Multi-capture patterns use a bag: `({ a, b }) => …`.
- Predicates keep types as-is; type-guard callbacks narrow both the bag and the
  embedded capture tokens in the node. See `src/ast/node-with-when/` for full
  semantics and examples.

## Examples

```ts
// Single-capture: value-only callback
const r = U.ReturnStatement({ argument: $("arg") }).when((arg) => arg != null);

// Bag form: multiple captures
const i = U.IfStatement({
  test: $("t"),
  consequent: $("c"),
  alternate: $("a"),
}).when(({ a }) => a != null);
```
