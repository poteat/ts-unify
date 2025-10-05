# NormalizeBag

Lift `NormalizeCaptured` over a capture bag. Its purpose is purely ergonomic:
ensure that when a helper maps a bag, the resulting bag carries stable, public
category types per key, ready for substitution.

## What and Why

- What: for a bag `{ k: V }`, produce `{ k: NormalizeCaptured<V> }`.
- Why: a mapped bag might assemble values from fluent nodes or tagged shapes;
  this guarantees a normalized result before structural substitution.

## Where it fits

- Used by the bag overload of `.map` to stabilize the new bag’s value types
  prior to `SubstituteCaptures`.
- Complements `NormalizeCaptured` (single value) and `SubstituteSingleCapture`
  (single key): together they keep capture substitution simple and predictable.
