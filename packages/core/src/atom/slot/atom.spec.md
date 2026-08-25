# Atom

## Overview

`Atom<Value, Name>` is the type of a slot: a symbol under `key`, a phantom
carrying `Value`, and a phantom carrying `Name`. Slots are declared in
vocabulary folders, one alias and one const to a slot, and imported by
both the definition that fills one and the definitions that read it:

```typescript
export type Clock = Atom<{ readonly now: number }>
export const Clock = atom<Clock>('Clock')

export type CacheDir = Atom<string, 'CacheDir'>
export const CacheDir = atom<CacheDir>('CacheDir')
```

## Semantics

- Identity is by reference at runtime: two slots are two symbols, and a
  store never confuses them.
- To the checker a slot is its type, `Atom<Value, Name>`, and both
  parameters are invariant: the phantoms are `(value: Value) => Value` and
  `(name: Name) => Name`, so `Atom<{ n: number }>` and `Atom<{ n: number;
m: string }>` satisfy neither each other nor `Atom<unknown>`, and
  `Atom<string, 'CacheDir'>` and `Atom<string, 'RepoRoot'>` are two types.
  Completeness (`Missing`, `MissingBelow`) and membership (`IsFilled`)
  compare slot types, so leaving `CacheDir` unfilled is an error naming
  it, whatever else of type `string` is filled.
- `Name` defaults to `never`. An atom over a value type no other atom
  carries is declared unnamed, `Atom<{ readonly now: number }>`; a name is
  given where the value type is shared, `Atom<string, 'CacheDir'>`. Two
  unnamed atoms over one value type are one type to the checker, though
  two slots at runtime; this is accepted here, and a lint rule over a
  vocabulary, not this library, reports it. An unnamed atom and a named one
  over the same value type are two types.
- The name is on the atom's type, not on the value: a plain `string`
  fills `Atom<string, 'CacheDir'>`, and `get(CacheDir)` hands a plain
  `string` back. This is Jotai's `Atom<Value>` with a name beside it;
  values stay ordinary, and nothing is branded.
- The literal is the alias's own name, by convention; a lint rule will
  hold it. A vocabulary declared through `atoms` is named by its keys,
  with no literal to keep in step. The literal is never read at runtime; the label passed to
  `atom` is what error text says, and the two agree by the same convention.
- `Keyed` is the type every slot extends, for constraints that need a top:
  `Atom` has none, being invariant in both parameters.

## Errors

The checker prints the alias where there is one: a missing slot is
`MissingDeps<CacheDir>`, an unfilled one `Unfilled<CacheDir>`, a
definition `Definition<RepoRoot, NoDeps>`. An atom written inline prints
as `Atom<{ readonly now: number; }>`; the defaulted name is left out.
