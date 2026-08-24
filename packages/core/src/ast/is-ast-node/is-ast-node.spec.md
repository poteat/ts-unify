# IsAstNode

## Overview

`IsAstNode<T>` is `true` when `T` is a concrete `TSESTree.Node` and `false`
otherwise.

## Scope

- A guard for conditional types that keep the checked type in their true
  branch, such as the node short-circuits in `BindCaptures` and
  `SubstituteCaptures`.

## Semantics

- Written as `T extends TSESTree.Node ? T : …`, the compiler narrows `T` in the
  true branch to `T & TSESTree.Node`. When it later needs the constraint of a
  still-generic pattern, it spreads that intersection over every node kind, and
  each member's `parent` (a node) meets the pattern's own `parent` (a pattern
  over every node kind): a cross product past the compiler's union limit.
- Branching on `IsAstNode<T> extends true` leaves `T` unnarrowed in the true
  branch, so the constraint is the pattern itself.
- The case that reaches the constraint: a builder call under a contextual type,
  `Object.freeze(U.Identifier({ name: $("n") }))`. `Object.freeze`'s first
  overload types its argument as `Function`, whose `bind` meets the pattern's
  `.bind`, and inference instantiates `.bind`'s return type while the pattern
  is still generic.

## Examples

```ts
type A = IsAstNode<TSESTree.Identifier>; // true
type B = IsAstNode<{ parent?: unknown }>; // false
```
