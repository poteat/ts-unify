# reify

## Overview

`reify(value, sourceCode?)` converts a proxy tree (built via the `U.*` builder)
into a plain ESTree-compatible object suitable for printing with recast or other
code generators.

## Scope

- Engine-agnostic: does not depend on ESLint or any particular parser.
- Recursively walks proxy nodes and arrays; passes through primitives and plain
  objects unchanged.

## Design

- **Inputs**: `value` (a proxy node, array, or primitive) and an optional
  `sourceCode` handle (reserved for future use).
- **Output**: A plain ESTree object with `type` set to the proxy node's tag and
  properties recursively reified.

## Examples

```ts
import { reify } from "@/runtime/reify";

const ast = reify(U.Identifier({ name: "x" }));
// ast => { type: "Identifier", name: "x" }
```
