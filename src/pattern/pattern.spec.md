# Pattern Specification

## Overview

`Pattern<T>` represents a shape where each position may be:

- The original type `T` (recursively),
- A placeholder token used in patterns, or
- An explicit capture token.

This type is used for builder APIs that accept pattern inputs. It does not
perform any conversion itself.

## Semantics

- Objects: either a placeholder token, or an object whose properties are
  `Pattern<T[K]>` for each property `K`.
- Tuples/arrays: either a placeholder token, or a tuple/array whose elements are
  `Pattern` of the original element types.
- Primitives: either `T` itself, a placeholder token, or an explicit capture
  token.

## Notes

- Consumers that interpret patterns (e.g., matchers or finalizers) define how
  placeholder names are derived (commonly from property keys or tuple indices).
- This module does not impose naming rules or perform any processing.
