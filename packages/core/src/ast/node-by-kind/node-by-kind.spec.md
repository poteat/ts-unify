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
- `Comment` maps to `CommentNode`, which has no upstream interface.
- `Program` is the upstream interface with `comments` retyped as
  `CommentNode[]`: a pattern over `Program.comments` is written against the
  node view, which is what a match presents there.

## Usage

- `NodeByKind['IfStatement']` → `TSESTree.IfStatement`
- `NodeByKind['Identifier']` → `TSESTree.Identifier`
- `NodeByKind['Comment']` → `CommentNode`
