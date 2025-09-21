# NodeWithTo

## Overview

`NodeWithTo<N>` adds a terminal `.to` method to a builder‑returned node so you
can attach a rewrite at the point you define the pattern. The `.to` callback
receives the node’s capture bag and returns an arbitrary result type (commonly
another builder‑produced node). The result is an `AstTransform` with `from` and
`to` fields, suitable for later runtime processing.

## Scope

- Provider type used by builder‑returned nodes. Defines `.to` typing only; no
  runtime behavior is prescribed here.
- Root‑only usage is enforced by types: `.to` returns a semantic descriptor that
  is not a `Pattern<…>`, so it cannot be embedded in other patterns.

## Design

- Terminalization: `.to` returns `AstTransform<In, Out>`, ensuring that finalized
  nodes are not accepted where a `Pattern` is expected.

## Semantics

- The `bag` parameter reflects `ExtractCaptures<N>` and includes any narrowing
  applied by preceding `.when` calls.
- The `.to` result is intentionally unconstrained here; consumers may restrict
  it to builder‑produced nodes.

## Examples

```ts
const p = U.ReturnStatement({ argument: $("arg") })
  .when((arg): arg is string => true)
  .to(({ arg }) => U.ReturnStatement({ argument: arg }));
// `p` is an `AstTransform<In, Out>`: { from: In; to: (bag) => Out }
```
