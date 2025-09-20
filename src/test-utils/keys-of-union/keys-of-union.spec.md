# KeysOfUnion

## Overview

`KeysOfUnion<T>` produces the union of property keys across a union type `T`. It
is primarily useful in tests for checking name collisions against unions of AST
node shapes.

## Semantics

- Distributes over unions: `T extends any ? keyof T : never`.
- For non-union `T`, results in `keyof T`.

## Examples

```ts
type U = { a: 1 } | { b: 2 };
type K = KeysOfUnion<U>; // "a" | "b"
```
