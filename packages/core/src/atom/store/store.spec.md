# Store

## Overview

The runtime behind `createStore`, and an imperative form of it.

## Usage

```typescript
const store: Store = new Store()
store.add(clock)
store.add(stamp)
store.get(Stamp)
```

## Narrowing

`add` is an assertion: `asserts this is Store<[...R, F], Parent>`. The
binding needs an explicit type annotation; each call narrows it to a
store whose phantoms cover one more definition. A conditional `add`
leaves a union of store types behind, so nothing reads `R` back out of
the binding: membership and the deps walk go through two phantoms.

- `accepts?: (slot: Fills) => void` holds the filled slots, this store's
  and its parents', in parameter position. `IsFilled` asks whether it
  takes a slot; over a union of store types the answer is `boolean`
  unless every branch takes it.
- `holds?: (definition: Held) => void` holds the definitions the same
  way; `Held` reads the union back off it, which `MissingBelow` walks.

So after

```typescript
store.add(clock)
if (flag) store.add(twice)
```

`get(Clock)` is accepted and `get(Twice)` is not.

## get

`get` takes `Accepted<this, A>`, `A` the slot's `Atom` alias, and returns
`ValueOf<A>`: the slot itself is accepted when the store fills it and
everything reachable from its definition's deps; otherwise the parameter
is `Unfilled<A>` or `MissingDeps<M>` with the missing slots in `M`, so the
argument fails to type-check with them named. The walk carries what it
has visited, so a cycle ends it.

## scope

`scope(...definitions)` is a child `Store<S, this>`: it builds its own
definitions in its own memo and falls back to the parent for the rest, so
a per-request value is built per scope while the parent's values are
shared.

A scope fills only slots the parent does not. The other rule, letting a
scope re-fill a parent's slot, was not taken: a parent's definition that
reads the re-filled slot is built in the parent's memo with the parent's
value, so a child's `get` of it would see the parent's value and a child
definition over the same slot would see the child's. Rather than two
answers for one slot, a re-fill is refused: at the type level the rest
parameter collapses to `Refills<Clock>` naming the slot, and at runtime
the child throws `Clock is filled above this scope already`.

## Runtime

A `Map` of definitions by the slot's symbol, a `Map` memo, and a `Set` of
symbols being built. `resolve` reads the memo or builds; a symbol found in
the building set is a cycle. A definition's deps are built before its
read runs, each in declared order. Two casts sit at the doors: `runRead`
hands a read the deps object the store built by name, and `get` hands the
memo's `unknown` back as the slot's type.
