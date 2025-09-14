# Bind Captures Specification

## Overview

`BindCaptures<P, Shape>` derives a fully-specified capture structure from a
pattern `P` and a reference shape `Shape` by replacing placeholder tokens with
named captures.

## Semantics

- Implicit placeholders at key `K` become `Capture<K, Shape[K]>`.
- Explicit `Capture<Name, V>` retains `V`. If `V` is `unknown`, it is upgraded
  to the corresponding type from `Shape` at the same position.
- Objects, tuples, and arrays are traversed recursively.
- A root-level placeholder (no key context):
  - If `Shape` is a tuple, binds each index:
    `[Capture<"0", T0>, Capture<"1", T1>, …]`.
  - If `Shape` is an array, binds to
    `ReadonlyArray<Capture<`${number}`, Elem>>`.
  - If `Shape` is an object, binds every top-level key:
    `{ [K in keyof Shape]: Capture<K, Shape[K]> }`.
  - Otherwise, resolves to `never`.
