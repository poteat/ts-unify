# Definition

## Overview

`Definition<A, D>` is what `atom(slot, deps, read)` returns: the slot
filled, the slots read by name, and the read function over their values.

## Semantics

- `slot: A` with `A extends Keyed`, the slot's `Atom` alias; `deps: D`
  with `D extends Deps`; `read: (deps: Of<D>) => ValueOf<A>`.
- `Definition<A, NoDeps>` is the two-argument form; its read takes no
  parameter.
- Every `Definition<A, D>` is a `Filling`, the untyped shape a store
  holds; `Filling` is what a store's tuple is constrained to, since
  `Atom<Value, Name>` has no top instance but `Keyed`.
- The error on an incomplete store prints a definition by its slot's
  alias: `Definition<RepoRoot, NoDeps>`.
