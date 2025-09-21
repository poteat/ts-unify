# FluentNode

## Overview

`FluentNode<N>` composes a node shape `N` with the fluent helpers:

- `.when(...)` constraint chaining (see `NodeWithWhen`)
- `.to(...)` terminal rewrite (see `NodeWithTo`)

Builders return `FluentNode`, and each `.when` call also returns `FluentNode`
so `.to` remains available until you finalize.

## Semantics

- Root-only `.to` via terminalization: `.to` returns an `AstTransform<In, Out>`
  which is not a `Pattern`, so you cannot embed the result into other patterns.
- Narrowing: `.when` guards refine capture types, which flow into the `bag`
  seen by `.to`.

## Examples

```ts
const p = U.ReturnStatement({ argument: $("arg") })
  .when((arg): arg is string => true)
  .to(({ arg }) => U.ReturnStatement({ argument: arg }));
```

