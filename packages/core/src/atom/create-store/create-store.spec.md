# createStore

## Overview

Builds a `Store` over a list of definitions, in any order.

## Usage

```typescript
const store = createStore(clock, settings, stamp)
store.get(Stamp) // Stamp
```

## Semantics

- The tuple is inferred exactly (a `const` type parameter); order is
  irrelevant. Values are built lazily, on first `get`, and once.
- The call type-checks only when every slot any definition reads is
  filled by one of them (`Complete`); a missing slot is named in the
  error on the first argument.
- `get` accepts only a filled slot (`Accepted`), and hands back its value
  type, `ValueOf`; an unfilled one fails with `Unfilled<CacheDir>` named.
  Two slots over one value type are told apart by their names: a store
  filling `RepoRoot` alone refuses `get(CacheDir)`.
- A later definition for a slot replaces an earlier one.

## Runtime

- A cycle throws an `Error` naming the reader and the slot under
  construction: `Pong reads Ping, which is still being built`.
- A slot nothing fills throws `Settings is not filled (read by Stamp)`;
  the type level refuses the call first. A slot declared with no label
  is `an unlabelled atom` in either message.
- `createStore` checks that every argument is a definition, since the
  type-level error objects never exist at runtime.
