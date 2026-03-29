# Capturable Specification

## Overview

`Capturable<T>` is a type-level alias for `T | CaptureLike<T>`. It expresses a
leaf position that can be supplied either as a concrete value of type `T` or as
an implicit/explicit capture token, without implying recursion into nested
structures.

## Notes

- Prefer `Pattern<T>` for deep, recursively structured patterns. Use
  `Capturable<T>` for single fields or non-recursive positions.
