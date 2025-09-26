# Sealed

## Overview

`Sealed<N>` is a type-level brand applied by `.seal()`. It marks a subtree so
that, when it is embedded under an object property in a larger pattern, a single
inner capture can be re-keyed to the embedding property name during capture
extraction.

## Scope

- Provider type for the sealing brand only. It does not define any fluent
  methods; see `NodeWithSeal` for the `.seal()` method that applies this brand.
- Extraction behavior is described in `ExtractCaptures` where sealed subtrees
  are recognized and re-keying is applied when applicable.

## Semantics

- Brand: Intersects `N` with a readonly `__sealed__` marker property.
- Re-keying: If the sealed subtree’s extracted capture bag has exactly one key
  and the subtree is the value of an object property `K`, the inner capture key
  is renamed to `K`. Otherwise, the bag is unchanged.
- No root effect: Sealing at the root has no re-keying effect.

## Examples

```ts
type Inner = { type: "ReturnStatement"; argument: Capture<"x", number> };
type Pat = { consequent: Sealed<Inner> };
// ExtractCaptures<Pat> includes { consequent: number }
```
