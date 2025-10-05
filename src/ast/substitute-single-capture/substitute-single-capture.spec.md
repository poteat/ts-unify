# SubstituteSingleCapture

A small but important building block: “replace the one captured value in this
node with the (normalized) type of Expr.” It captures the intent of
single‑capture refinement in a name that’s easy to reach for, and keeps more
expressive fluent helpers focused.

## What and Why

- What: a type alias that applies `SubstituteCaptures` with a one‑key bag,
  where that key is the node’s single capture key and the value is the
  normalized expression type.
- Why: de‑duplicates boilerplate across `.default` and the single‑capture `.map`
  overload, and lets their specs talk in terms of this concept rather than the
  raw mechanics.

## Semantics

- Uses `SingleKeyOf<ExtractCaptures<Node>>` to identify the single capture key
  (call sites should already be gating on the single‑capture condition).
- Normalizes `Expr` with `NormalizeCaptured` to avoid overly specific unions and
  to accept either fluent nodes or `{ type: … }` shapes.
- Leaves structure outside the capture intact; only re‑types the captured value
  at that one capture key.

## Relationship to Other Concepts

- Built on top of `SubstituteCaptures` (structural rewrite) and
  `NormalizeCaptured` (type stabilization for Expr).
- Used by `NodeWithDefault` and single‑capture `NodeWithMap`.
