# BuilderMap

## Overview

`BuilderMap` is the registry shape mapping each `NodeKind` to its
`PatternBuilder<K>`. It represents the public surface of builder namespaces like
`U`. In addition to builders keyed by `NodeKind`, the map may include typed
utility members (see `BuilderUtilities`) that are convenient to use with fluent
helpers.

## Semantics

- Builders: The key space includes all `NodeKind`, where for key `K`, the value
  is `PatternBuilder<K>`.
- Helpers: The map may also include utility members from `BuilderUtilities` that
  are not tied to a specific kind. These are provider‑scoped utilities to
  improve ergonomics when composing builders and fluent helpers.

## Usage

- Used as the type of the exported `U` namespace of builders.
- Enables typed composition and discovery of available builders by kind.
