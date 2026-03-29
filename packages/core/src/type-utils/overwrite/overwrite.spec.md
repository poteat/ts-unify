# Overwrite

## Overview

`Overwrite<Left, Right>` creates a new object type by replacing properties in
`Left` with those from `Right` when keys collide, and adding any new keys from
`Right`.

## Design

- Defined as `Omit<Left, keyof Right> & Right`.
- Colliding keys take their type (and modifiers) from `Right`.
- Non-colliding keys from `Left` are preserved.

## Examples

```ts
type A = { id: number; name: string };
type B = { name: readonly string[]; active?: boolean };

type R = Overwrite<A, B>;
// R = { id: number; name: readonly string[]; active?: boolean }
```
