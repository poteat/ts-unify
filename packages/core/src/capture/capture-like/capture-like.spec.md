# CaptureLike Specification

## Overview

`CaptureLike<Value = unknown>` is a type-level token representing either a
placeholder token or an explicit capture token constrained to value type `V`. It
is convenient for APIs that accept a position to be "capturable" without
committing to whether the capture is implicit or explicit.

## Semantics

- `CaptureLike<Value>` is the union of the placeholder token type and
  `Capture<string, Value>`.
- It does not perform any interpretation on its own; consumers decide how to
  interpret placeholder vs explicit capture.
