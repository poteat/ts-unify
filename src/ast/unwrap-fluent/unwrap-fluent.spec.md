# UnwrapFluent

Type helper that removes the fluent wrapper from a node type.

## Definition

```
type UnwrapFluent<T> = T extends FluentNode<infer N> ? N : T;
```

## Purpose

- Used by other helpers (e.g., `NormalizeCaptured`) to accept either plain node
  shapes or fluent nodes and work uniformly.
- Keeps local helpers focused by factoring the fluent unwrapping into a single
  place.

## Notes

- If `T` is not a `FluentNode<…>`, it is returned unchanged.
