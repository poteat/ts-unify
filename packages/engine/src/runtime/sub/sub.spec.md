# sub / contains

## Overview

`sub(tree, target, replacement)` performs structural substitution on an AST
tree. Every node in `tree` that is structurally equal to `target` is replaced
with `replacement`. Returns a new tree; does not mutate the input.

`contains(tree, target)` checks whether `target` appears anywhere in `tree`
(structural equality). The read-only companion to `sub`.

Both are the AST analogs of term operations: `sub` is beta reduction
`M[x := N]`, `contains` is free-variable occurrence checking.

## Scope

- Runtime utility exported from `@ts-unify/engine`.
- Intended for use inside `.to()` factories when a rule needs to replace
  occurrences of a captured node within a captured subtree.

## Design

- Uses the same `deepEqual` as the match engine (ignores `parent`, `loc`,
  `range` keys during comparison).
- Walks the tree recursively, depth-first. At each node, checks structural
  equality against `target` before recursing into children.
- Arrays are mapped element-wise.
- Primitives and non-object values are returned as-is.
- The comparison is on the full structural shape of `target`, not just the
  `type` field. Two Identifiers with different names are not equal.

## Examples

```ts
import { sub } from "@ts-unify/engine";

// Replace Identifier("handler") with MemberExpression("config.onError")
const result = sub(
  { type: "CallExpression", callee: { type: "Identifier", name: "handler" }, arguments: [] },
  { type: "Identifier", name: "handler" },
  { type: "MemberExpression", object: { type: "Identifier", name: "config" }, property: { type: "Identifier", name: "onError" } }
);
// result.callee is now the MemberExpression
```

```ts
// Used inside a rule's .to():
.to(({ before, after, id, init, stmt }) =>
  U.BlockStatement({
    body: [...before, sub(stmt, id, init), ...after],
  })
)
```
