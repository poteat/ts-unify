# NodeWithWith

Adds a fluent `.with(fn)` to fluent nodes that merges a new bag into the current
capture bag.

- Overwrites colliding keys with the new bag's entry type.
- Adds new keys that downstream `.to(...)` can consume.
- Applies updated types to all capture occurrences in the node shape.

## Typing

Given a node `N` with capture bag `B = ExtractCaptures<N>`, and
`fn: (bag: B) => NewBag`:

- Produces `Merged = Overwrite<B, NormalizeBag<NewBag>>`.
- Returns
  `FluentNode<SubstituteCaptures<N, Merged> & { [WITH_BRAND]: Merged }>`.
  - `SubstituteCaptures` updates capture occurrences in the node shape.
  - A brand carries the merged bag so extractors (e.g. `.to(...)`) see added
    keys.

## Why a brand?

`ExtractCaptures` derives bag keys by scanning capture occurrences in the node.
Keys added by `.with(...)` have no corresponding capture occurrence, so they
would be invisible. The brand makes added keys visible to downstream helpers
without changing node shapes.
