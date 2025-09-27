# SubstituteCaptures

## Overview

`SubstituteCaptures<Node, Bag>` is a type‑level utility that structurally
applies a capture bag `Bag` to a node shape `Node`.

- Rewrites embedded capture/spread occurrences to reflect types from `Bag`.
- Preserves brands (e.g., `Sealed<…>`) while transforming inner shapes.
- Recurses through objects, tuples, and arrays.

## Scope

- Provider type used internally by fluent helpers (e.g., `.when`, `.map`).
- Purely type‑level: no runtime behavior is prescribed.
- Does not perform re‑keying or name rewriting — that is handled during capture
  extraction (see `ExtractCaptures`).

## Semantics

- Capture occurrences:
  - `Capture<'name', _>` becomes `Capture<'name', Bag['name']>` when `'name'`
    exists in `Bag`; otherwise unchanged.
- Spread occurrences:
  - `Spread<'name', Elem>` becomes `Spread<'name', ElemN>` when `Bag['name']` is
    `ReadonlyArray<ElemN>`; otherwise unchanged.
- Structural recursion:
  - Tuples/arrays: element‑wise application.
  - Objects: property‑wise application to all fields.
- Branding:
  - `Sealed<N>` remains sealed; the inner `N` is transformed and re‑wrapped as
    `Sealed<…>`.

## Design

- Simple, policy‑free substituter: it takes `Node` and `Bag` as given.
- Callers optionally normalize `Bag` values before substitution (e.g., unwrap
  fluent builders, rehydrate to full ESTree node interfaces, collapse category
  unions) when that behavior is desired.
- Keeps responsibilities clear: extraction decides names/keys; substitution
  updates occurrences.

## Examples

```ts
// Bag drives capture value types
type Node = { type: "ReturnStatement"; argument: Capture<"arg", unknown> };
type Bag = { arg: string };
// Substitute: Capture<'arg', unknown> → Capture<'arg', string>
type Out = SubstituteCaptures<Node, Bag>;
//     ^? { type: 'ReturnStatement'; argument: Capture<'arg', string> }

// Spread follows array element type
type N2 = [string, Spread<"xs", number>, number];
type B2 = { xs: ReadonlyArray<boolean> };
// xs element type changes to boolean
type O2 = SubstituteCaptures<N2, B2>;
//   ^? [string, Spread<'xs', boolean>, number]
```

## Notes

- Re‑keying of sealed subtrees is handled by `ExtractCaptures` at extraction
  time; substitution does not rename capture keys.
- Compose with higher‑level helpers by pre‑normalizing `Bag` where needed (e.g.,
  `.map` unwraps builders and collapses category unions before substitution).
