# SingleKeyOf

## Overview

`SingleKeyOf<T>` yields the only key of an object type `T` when it has exactly
one key; otherwise it yields `never`.

## Use Cases

- Enabling single‑entry ergonomics, e.g. special overloads for exactly one
  capture in a bag.
- Guarding re‑keying logic that only applies when a bag has precisely one entry.

## Examples

```ts
type One = SingleKeyOf<{ a: 1 }>; // "a"
type Many = SingleKeyOf<{ a: 1; b: 2 }>; // never
type None = SingleKeyOf<{}>; // never
type NonObj = SingleKeyOf<string>; // never
```
