# NodeByKind

## Overview

`NodeByKind` is a mapped type from `NodeKind` to the corresponding
`TSESTree.Node` interface for that kind.

## Scope

- Provider-facing: expresses upstream shapes from `@typescript-eslint/types`.
- Consumers can index by a discriminant to obtain the precise node interface.

## Design

- Implemented via `Extract<TSESTree.Node, { type: … }>` to avoid duplicating AST
  interfaces and to remain aligned with upstream.
- The discriminant is taken from `TSESTree.AST_NODE_TYPES[K]` ensuring the
  mapping is robust to enum representation.

## Usage

- `NodeByKind['IfStatement']` → `TSESTree.IfStatement`
- `NodeByKind['Identifier']` → `TSESTree.Identifier`
