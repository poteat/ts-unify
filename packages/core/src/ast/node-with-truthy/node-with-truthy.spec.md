# NodeWithTruthy

## Overview

`NodeWithTruthy<Node>` adds a fluent `.truthy()` method to a builder-returned
node. Calling `.truthy()` narrows the single capture's value type by excluding
JS-falsy values (`false | 0 | 0n | "" | null | undefined`).

It is sugar for `.when(U.truthy)` and is only available on single-capture nodes.

## Semantics

- Single-capture nodes: `.truthy()` returns a new fluent node whose single
  capture value type is `Exclude<V, Falsy>`.
- Zero-capture or multi-capture nodes: the method signature accepts a `never`
  rest parameter, making it uncallable (compile-time gate).

## Examples

```ts
// Single capture -- narrows nullable to non-null
type Node = {
  type: "ReturnStatement";
  argument: Capture<"arg", string | 0 | null | "">;
};
type Narrowed = Node & NodeWithTruthy<Node>;
// .truthy() narrows arg from `string | 0 | null | ""` to `string`

// Zero captures -- gated out
type Zero = { type: "X" } & NodeWithTruthy<{ type: "X" }>;
// Zero.truthy() is uncallable (ts-expect-error)
```

## Scope

Provider type used by builder-returned nodes. Defines `.truthy` typing and
narrowing behavior; it does not perform runtime matching.
