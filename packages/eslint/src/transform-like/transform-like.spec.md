# TransformLike

## Overview

`TransformLike` is the type accepted by `createRule` and `createPlugin` to
represent any value produced by the fluent builder API (`U`). It is the union
of the two shapes the builder returns: a bare pattern (`MatchLike`) and a
transform with `.to()` (an `AstTransform`).

## Design

- `MatchLike` is `{ readonly [FLUENT_INNER]: unknown }`: the brand every
  `FluentNode<N>` carries. A rule built from one has no rewrite; it reports
  each match with the default message or the `.message()` text.
- The second member, `{ readonly [k: symbol]: ProxyNode }`, is the shape of
  the `.to()` result: the `NODE` symbol (from `@ts-unify/core`) carries the
  proxy trace through the builder chain.
- Any value returned by `U.SomeNode(...)`, `U.or(...)`, or a chained fluent
  call (`.to(...)`, `.when(...)`, etc.) satisfies `TransformLike`.

## Examples

```ts
import type { TransformLike } from "@ts-unify/eslint";
import { U, $ } from "@ts-unify/core";

// All of these satisfy TransformLike:
const a: TransformLike = U.Identifier({ name: $("n") });
const b: TransformLike = U.IfStatement({ test: $("cond") }).to(() => ({}));
```
