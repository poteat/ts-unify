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

- Terminalization: `.to` returns `AstTransform<In, Out>`, ensuring that
  finalized nodes are not accepted where a `Pattern` is expected.

### Zero-arg Sugar (Single Capture)

- When the capture bag has exactly one entry, a zero-arg `.to()` is available
  and returns that capture value as the output type (after `NormalizeCaptured`).
- In zero- or multi-capture contexts, the zero-arg overload is disabled and
  resolves to `never`, producing a clear type error.

## Semantics

- The `bag` parameter reflects `ExtractCaptures<N>` and includes any narrowing
  applied by preceding `.when` calls.
- The `.to` result is intentionally unconstrained here. You may return a
  builder‑produced node (e.g., `U.Kind({...})`) or any other value your
  pipeline expects. Downstream consumers can constrain this further.

### Builder Overload Safety

- The `.to(builder)` overload is accepted only when every key in the capture bag
  is a valid property key of the target builder’s node kind. This prevents
  accidentally passing a bag with misspelled or unrelated keys (e.g., `foobar`)
  to a builder that expects `{ test, consequent, alternate }`.
- Use the factory form `.to((bag) => builder(bag))` when you need more flexible
  assembly; general object assignability rules apply in that case.

## Examples

```ts
const p = U.ReturnStatement({ argument: $("arg") })
  .when((arg): arg is string => true)
  .to(({ arg }) => U.ReturnStatement({ argument: arg }));
// `p` is an `AstTransform<In, Out>`: { from: In; to: (bag) => Out }

// Zero-arg sugar: when there is exactly one capture in the bag, return it
// directly as the output.
const q = U.ReturnStatement({ argument: $("expr") }).to();
// `q` is `AstTransform<In, Expression>`
```
