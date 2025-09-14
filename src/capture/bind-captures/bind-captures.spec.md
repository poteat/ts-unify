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

## Sequence Spreads (arrays/tuples)

`Spread<Name, Elem>` is a sequence-only capture token whose generic represents
the element type of the slice. `BindCaptures` refines `Elem` using the reference
shape when possible.

### Arrays (`readonly E[]`)

- For a spread item `Spread<'xs', Elem>` in a pattern against shape
  `readonly E[]`:
  - If `Elem` is `unknown`, bind to `Spread<'xs', E>`.
  - Otherwise, bind to `Spread<'xs', Elem & E>`.
- Non-spread items in array patterns bind against `E` (i.e., `S[number]`).

### Tuples (fixed or variadic)

- For now, spreads bind conservatively by element type using `S[number]`:
  - `Spread<'xs', Elem>` → `Spread<'xs', Elem & S[number]>` (or `S[number]` if
    `Elem` is `unknown`).
- Future work may refine tuple spreads into precise unions of slice tuples based
  on anchor placements. Adjacent spreads are considered DC and have no specified
  behavior here.

### Examples

```ts
type S1 = ReadonlyArray<string | number>;
type P1 = [Capture<"head">, Spread<"rest">, Capture<"tail">];
type R1 = BindCaptures<P1, S1>;
/**
 * [
 *   Capture<'head', string | number>,
 *   Spread<'rest', string | number>,
 *   Capture<'tail', string | number>
 * ]
 */
type P2 = [Spread<"xs", string>];
type R2 = BindCaptures<P2, S1>; // [Spread<'xs', string>]
```
