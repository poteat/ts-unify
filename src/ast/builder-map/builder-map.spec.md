# BuilderMap

## Overview

`BuilderMap` is the registry shape mapping each `NodeKind` to its
`PatternBuilder<K>`. It represents the public surface of builder namespaces like
`U`.

## Semantics

- The key space is exactly `NodeKind`.
- For key `K`, the value is `PatternBuilder<K>`.

## Usage

- Used as the type of the exported `U` namespace of builders.
- Enables typed composition and discovery of available builders by kind.
