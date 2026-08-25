# atom

## Overview

One function, three forms, chosen by arity alone: a slot, a definition
with no deps, a definition over deps. Nothing is read off the shape of
the read function.

## Usage

```typescript
type Clock = Atom<{ readonly now: number }>
const Clock = atom<Clock>('Clock')

const clock = atom(Clock, () => ({ now: Date.now() }))
const stamp = atom(Stamp, { clock: Clock }, deps => `at ${deps.clock.now}`)
```

## Semantics

- `atom<T>(label?)`: a slot, `Declared<T>`: `T` itself when it is the
  slot's `Atom` alias, else the unnamed `Atom<T>` over the value type `T`,
  the form an entry of `atoms` takes. The type is given explicitly; the
  label is for error text alone. A union value type declares one slot
  over the union, `Atom<string | undefined>`, never a slot per member.
  A slot carries no value and no deps.
- `atom(slot, read)`: a definition that reads nothing, `Definition<A,
NoDeps>`; `read` takes no parameter and returns `ValueOf<A>`. This is
  the form for a value with no deps; the three-argument form with `{}` is
  never needed.
- `atom(slot, deps, read)`: a definition over `deps`, an object of slots
  written once as values, `Definition<A, D>`. `D` is inferred as a
  `const`, and `read` receives `Of<D>`: the same keys, each slot replaced
  by its value type. `read` must return `ValueOf<A>`.
- `A` is inferred from the slot alone. The read's return type is checked
  against it, never unified with it, so a definition's slot type is the
  alias the slot was declared with.
- Overloads, not a union: a slot alone, or a label with a read, is a
  compile error, and the runtime throws a `TypeError` for the same.

## Design

- A slot's identity is a symbol made by `Symbol(label)`, so a store keys
  on the symbol and an error reads the label back off its description.
- A definition is a plain object: the slot, the deps, the read. It is its
  own record and carries no symbol; the slot is the key.
