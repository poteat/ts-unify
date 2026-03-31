# TransformLike

## Overview

`TransformLike` is the type accepted by `createRule` and `createPlugin` to
represent any value produced by the fluent builder API (`U`). It is a branded
object carrying a `[NODE]` symbol key that points to the underlying `ProxyNode`
trace.

## Design

- Defined as `{ readonly [k: symbol]: ProxyNode }`.
- The symbol key is `NODE` (from `@ts-unify/core`), a well-known symbol used to
  carry proxy metadata through the builder chain.
- Any value returned by `U.SomeNode(...)`, `U.or(...)`, or a chained fluent call
  (`.to(...)`, `.when(...)`, etc.) satisfies this type.

## Examples

```ts
import type { TransformLike } from "@ts-unify/eslint";
import { U, $ } from "@ts-unify/core";

// All of these satisfy TransformLike:
const a: TransformLike = U.Identifier({ name: $("n") });
const b: TransformLike = U.IfStatement({ test: $("cond") }).to(() => ({}));
```
