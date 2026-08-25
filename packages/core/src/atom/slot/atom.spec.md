# Atom

## Overview

`Atom<T>` is the type of a slot: a symbol under `key`, and a phantom
carrying `T`. Slots are declared in vocabulary folders and imported by
both the definition that fills one and the definitions that read it.

## Semantics

- Identity is by reference at runtime: two slots of one type are two
  symbols, and a store never confuses them.
- To the checker a slot is its type: two slots declared `atom<X>()` are
  one type, `Atom<X>`. Completeness (`Missing`) and membership
  (`IsFilled`) therefore cannot tell two alike slots apart; the runtime
  does, and throws. A literal-typed label would be the one road to a
  nominal slot type, and it costs a redundant type argument; it was not
  taken.
- The phantom is `(value: T) => T`, so `T` is invariant: `Atom<{ n:
number }>` and `Atom<{ n: number; m: string }>` satisfy neither each
  other nor `Atom<unknown>`. `Keyed` is the type every slot extends, for
  constraints that need a top.
