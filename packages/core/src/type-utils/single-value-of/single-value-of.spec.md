# SingleValueOf

## Overview

`SingleValueOf<T>` yields the value type of the only property of an object type
`T` when it has exactly one key; otherwise it evaluates to `never`.

## Design

- Built on top of `SingleKeyOf<T>` to detect the single-key case.
- Used by fluent helpers to enable single-capture ergonomics (e.g., overloads
  that accept a direct `(value) => …` function when there is exactly one capture
  in the bag).

## Examples

```ts
type One = SingleValueOf<{ a: number }>; // number
type Many = SingleValueOf<{ a: 1; b: 2 }>; // never
type None = SingleValueOf<{}>; // never
type NonObj = SingleValueOf<string>; // never
```
