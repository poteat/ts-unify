# NodeWithBind

## Overview

Adds a fluent `.bind(...)` helper that captures the entire matched subtree and
clears any previously exposed capture bag entries contributed by that node.

## Scope

- Provider-side typing only; there is no runtime implementation.
- Applies to fluent AST nodes created by builder helpers.

## Design

- Introduces an exclusive bag brand `__only` that short-circuits
  `ExtractCaptures` to a supplied bag.
- Uses `NormalizeCaptured<Node>` (a.k.a. `WholeOf<Node>`) so the bound value
  reflects the static AST node shape.
- The zero-argument form reuses the same exclusive bag logic but also applies
  `Sealed` to the subtree to preserve property-level matching semantics.

## Semantics

- `.bind(name)` returns `FluentNode<BindExclusive<Node, name>>` where
  `BindExclusive`:
  - Drops existing `__with` / `__only` brands.
  - Substitutes the node with `BindBag = { [name]: NormalizeCaptured<Node> }`.
  - Reapplies the exclusive brand `readonly __only: BindBag`.
- `.bind()` is sugar for the same operation with the canonical name `"node"`
  and adds `Sealed` branding to the result.
- `ExtractCaptures` short-circuits on `__only`, returning exactly the exclusive
  bag while still merging any later `.with(...)` brands via `Overwrite`.
- Downstream helpers (`.map`, `.with`, `.to`, etc.) see only the exclusive bag
  entries unless new keys are added explicitly (e.g., via `.with`).

## Examples

```ts
const block = U.BlockStatement({
  body: [U.ExpressionStatement({ expression: $ })],
}).bind("body");

type Bag = ExtractCaptures<typeof block>;
// { body: TSESTree.Statement }
```

```ts
const stmt = U.Statement($).bind();
type Bag = ExtractCaptures<typeof stmt>;
// { node: TSESTree.Statement }
```
