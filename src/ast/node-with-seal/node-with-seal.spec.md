# NodeWithSeal

## Overview

`NodeWithSeal<N>` adds a fluent `.seal()` method to builder‑returned nodes.
Sealing a node declares that, when this node is embedded under an object
property in a larger pattern, and it has exactly one capture, that capture is
re‑keyed to the embedding property’s key.

This preserves single‑capture narrowing across abstraction boundaries (e.g.,
helpers) by aligning the inner capture name with the outer slot name.

## Scope

- Provider type used by builder‑returned nodes. Defines `.seal` typing/semantics
  only; no runtime behavior is prescribed here.
- `ExtractCaptures` recognizes sealed nodes during bag extraction and applies
  re‑keying when applicable.

## Design

- Sealed brand: `.seal()` marks the node with an opaque brand (type‑only). The
  brand is observed by `ExtractCaptures` when the sealed node is the value of an
  object property.
- Re‑key rule: If the sealed subtree’s capture bag has exactly one key, rename
  that key to the embedding property name. Otherwise, leave captures unchanged.
- No root effect: Sealing at the root (not under a property) does not re‑key.
- Stability: Re‑keying happens at extraction time; it composes with `.when`
  narrowing that may have been applied within the sealed subtree.

## Semantics

- Single‑capture subtree under property `K`:
  - Before: inner bag `{ inner: V }`
  - After: parent sees `{ [K]: V }`
- Multi‑capture or zero‑capture subtree:
  - Re‑keying is skipped (bag is preserved).
- Interaction with `.when`:
  - If a single‑capture guard narrows the inner value (e.g., from `T | null` to
    `T`), sealing ensures the parent bag reflects the narrowed type at the
    parent key.

## Notes

- You can freely chain `.when(...).seal()`; sealing does not prevent further
  fluent operations before terminalization.
