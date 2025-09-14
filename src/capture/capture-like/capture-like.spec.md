# CaptureLike Specification

## Overview

`CaptureLike` is a type-level token representing either a placeholder token or
an explicit capture token. It is convenient for APIs that accept a position to
be "capturable" without committing to whether the capture is implicit or
explicit.

## Semantics

- `CaptureLike` is defined as the union of the placeholder token type and the
  explicit capture token type.
- It does not perform any interpretation on its own; consumers decide how to
  interpret placeholder vs explicit capture.
