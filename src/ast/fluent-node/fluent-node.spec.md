# FluentNode

## Overview

`FluentNode<N>` composes a node shape `N` with the fluent helpers:

- `.when(...)` constraint chaining (see `NodeWithWhen`)
- `.seal()` single‑capture re‑keying hint (see `NodeWithSeal`)
- `.to(...)` terminal rewrite (see `NodeWithTo`)

Builders return `FluentNode`, returning `FluentNode` so `.to` remains available
until you finalize.

## Semantics

- Root-only `.to` via terminalization: `.to` returns an `AstTransform<In, Out>`
  which is not a `Pattern`, so you cannot embed the result into other patterns.
- Narrowing: `.when` guards refine capture types, which flow into the `bag` seen
  by `.to`.
- Re‑keying: `.seal()` indicates that, when this node is embedded as an object
  property and it has exactly one capture, that capture is re‑keyed to the
  embedding property’s name. Re‑keying composes with any prior `.when` narrowing
  inside the sealed subtree.

## Examples

### Type narrowing via guards

```ts
const p = U.ReturnStatement({ argument: $("arg") })
  .when((arg): arg is string => typeof arg === "string")
  .to(({ arg }) => U.ReturnStatement({ argument: arg }));
```

### Sealed subtrees:

```ts
const notNull = <T>(x: T): x is Exclude<T, null> => x != null;

const ret = U.ReturnStatement({ argument: $ }).when(notNull).seal();

const i = U.IfStatement({ test: $, consequent: ret, alternate: ret }).to(
  ({ test, consequent, alternate }) =>
    U.ConditionalExpression({ test, consequent, alternate })
);
```
