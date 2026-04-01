# symGet

## Overview

`symGet(v, s)` accesses a symbol-keyed property on an `unknown` value. It is
the single escape hatch for symbol indexing on values typed as `unknown`,
avoiding scattered `as any` casts throughout the runtime.

## Semantics

- Returns `(v as any)[s]`, i.e., the value stored under symbol `s` on object
  `v`.
- If `v` is not an object or does not have the symbol key, returns `undefined`
  (standard JS property access behavior).

## Examples

```typescript
const sym = Symbol("test");
const obj = { [sym]: 42 };

symGet(obj, sym); // 42
symGet({}, sym);  // undefined
symGet(null, sym); // throws (property access on null)
```

## Purpose

Centralizes the `as any` cast needed for symbol property access on `unknown`.
Used by `extractPatterns`, `reify`, `match`, and other runtime utilities that
inspect proxy node metadata stored under the `NODE` symbol.
