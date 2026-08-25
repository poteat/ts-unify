# Definition

## Overview

`Definition<T, D>` is what `atom(slot, deps, read)` returns: the slot
filled, the slots read by name, and the read function over their values.

## Semantics

- `slot: Atom<T>`, `deps: D` with `D extends Deps`, `read: (deps: Of<D>)
=> T`.
- `Definition<T, NoDeps>` is the two-argument form; its read takes no
  parameter.
- Every `Definition<T, D>` is a `Filling`, the untyped shape a store
  holds; `Filling` is what a store's tuple is constrained to, since
  `Atom<T>` has no top instance but `Keyed`.
