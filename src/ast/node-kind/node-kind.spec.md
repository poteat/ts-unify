# NodeKind

## Overview

`NodeKind` is the string-literal union of AST node discriminants. It mirrors the
keys of `TSESTree.AST_NODE_TYPES` from `@typescript-eslint/types`.

## Scope

- Provider-facing: reflects upstream enum keys; keeps our API decoupled from
  concrete node interfaces.
- Used to key maps such as `NodeByKind` and `BuilderMap`.

## Design

- Defined as `keyof typeof TSESTree.AST_NODE_TYPES` to stay in sync with the
  upstream package without copying identifiers.
- We use “Kind” instead of “Type” to avoid ambiguity with TypeScript’s concept
  of structural types, while acknowledging that ESTree uses a `type` field for
  the discriminant.

## Examples

- "IfStatement", "Identifier", "Literal", etc.
