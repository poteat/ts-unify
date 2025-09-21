# PatternBuilder

## Overview

`PatternBuilder<K>` creates typed AST patterns or concrete nodes for a kind `K`.

- Call with no args to get the discriminant only — “any `K`”.
- Call with a `Pattern<NodeByKind[K]>` to build a typed pattern with capture
  positions bound to the node’s shape (returns a `FluentNode`).
- Call with a concrete node shape (no capture tokens) to build a node and get a
  `FluentNode` back as well — you can still chain `.when`/`.to` even without
  captures.
- Returned nodes support fluent constraints via `.when` (see `NodeWithWhen`) and
  a terminal rewrite via `.to` (see `NodeWithTo`).

## Design

- Three overloads provide clear, minimal surfaces:
  - Discriminant `()` — lightweight `{ type: … }` when only the tag is needed.
  - Build `(shape)` — accepts a concrete node shape (no capture tokens) and
    returns a `FluentNode` for optional chaining.
  - Pattern `(pattern)` — accepts a capturable pattern and returns a
    `FluentNode` with `.when` and `.to`.

## Using `.when`

Pattern/builders return a `FluentNode` with `.when` and a terminal `.to`:

- Single-capture patterns can accept the value directly: `(v) => …`.
- Multi-capture patterns use a bag: `({ a, b }) => …`.
- Predicates keep types as-is; type-guard callbacks narrow both the bag and the
  embedded capture tokens in the node. See `src/ast/node-with-when/` for full
  semantics and examples.
- Use `.to((bag) => out)` to finalize with a rewrite. The `.to` result is not a
  `Pattern`, so it cannot be nested; this effectively scopes `.to` to the
  outermost pattern.

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

// Build form: concrete shape → fluent node
const out = U.ConditionalExpression({
  test: someExpr,
  consequent: otherExpr,
  alternate: altExpr,
}).when(() => true).to(({ test, consequent, alternate }) =>
  U.ConditionalExpression({ test, consequent, alternate })
);
```
