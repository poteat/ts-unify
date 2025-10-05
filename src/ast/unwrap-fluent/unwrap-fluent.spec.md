# UnwrapFluent

Erase the fluent “helper veneer” to reveal the underlying node shape.

## What and Why

- What: a tiny type that turns `FluentNode<N>` into `N` and leaves anything else
  unchanged.
- Why: lets provider helpers accept values that may or may not be fluent
  without having to carry that distinction in their local logic.

## Role in the System

- A foundational normalizer used by `NormalizeCaptured` (and indirectly by
  helpers like `.map`/`.default`). It keeps those helpers focused on their
  semantics instead of on plumbing away fluent wrappers.

## Definition (for reference)

```
type UnwrapFluent<T> = T extends FluentNode<infer N> ? N : T;
```

## Notes

- Purely a type‑level concept; no runtime effect.
- Does not recurse — it only removes the outermost fluent wrapper.
