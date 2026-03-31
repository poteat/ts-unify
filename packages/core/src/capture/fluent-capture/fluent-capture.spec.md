# FluentCapture

## Overview

`FluentCapture<Name, Value>` is the type returned by `$("name")`. It combines
the `Capture` brand, `Spread` iterability, `DollarObjectSpread` brand, and
fluent modifier methods into a single interface.

## Exports

- `CaptureBase<Name, Value>` — intersection of `Capture`, `Iterable<Spread>`,
  and `DollarObjectSpread`. The structural foundation without fluent methods.
- `FluentOps<Self, Value>` — the fluent modifier methods shared by capture-like
  carriers.
- `FluentCapture<Name, Value>` — `CaptureBase` extended with `FluentOps`.

## Fluent Methods

- `.map(fn)` — transform the captured value type via `NormalizeCaptured`.
- `.default(expr)` — provide a default when the captured position is
  `null`/`undefined`.
- `.defaultUndefined()` — sugar for `.default(undefined)`, typed as
  `TSESTree.Identifier`.
- `.truthy()` — narrow the captured value to exclude falsy types.
- `.when(guard)` — narrow via a type guard or filter via a predicate.

## Semantics

Each fluent method returns `Self & CaptureMods<Mod>`, accumulating modifier
brands that downstream extraction (`ExtractCaptures`) reads to refine the
capture's value type.
