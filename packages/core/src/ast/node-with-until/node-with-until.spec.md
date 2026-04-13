# NodeWithUntil

## Overview

`NodeWithUntil<N>` adds a fluent `.until(boundary)` method to builder-returned
nodes. It attaches a boundary pattern that controls how far `.excludes()`
walks when searching for the excluded node in a subtree.

The name follows LTL convention: in `A[!P U B]`, the search for `P` continues
*until* boundary `B` is reached.

## Scope

- Provider type used by builder-returned nodes. Defines `.until` typing only;
  runtime behavior is prescribed in `match.spec.md` under "Excludes".
- `.until()` is only meaningful when the node is passed as an argument to
  `.excludes()`. Using `.until()` on a top-level pattern has no effect.

## Design

- `.until(B)` records a chain entry `{ method: "until", args: [B] }`.
- The result is a `FluentNode<N>` (chainable), though in practice the only
  expected downstream consumer is `.excludes()`.
- `B` is a pattern (a builder-produced node or `U.or(...)` of nodes). At
  match time, descendants whose `type` matches `B` are treated as scope
  boundaries: the subtree walk does not recurse into them.

## Semantics

- `.until(B)` does not alter the match semantics of the node it is called on.
  It only attaches metadata that `.excludes()` reads.
- Multiple `.until()` calls on the same node are not supported. The last one
  wins (though the type system should guide toward a single call).
- `B` is tested via the same `matchProxyNode` machinery used for structural
  matching. A descendant is a boundary if its `type` matches any branch of `B`.

## Examples

```ts
// "ThisExpression, bounded by non-arrow functions"
U.ThisExpression().until(U.or(U.FunctionDeclaration(), U.FunctionExpression()))

// "BreakStatement, bounded by loops"
U.BreakStatement().until(
  U.or(U.ForStatement(), U.ForOfStatement(), U.ForInStatement(),
       U.WhileStatement(), U.DoWhileStatement())
)
```
