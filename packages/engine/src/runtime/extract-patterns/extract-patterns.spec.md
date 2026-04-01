# extractPatterns

## Overview

`extractPatterns(rule)` extracts all `{ tag, pattern }` entry points from a
rule's proxy trace. This is the primary function used to discover which AST node
types a pattern targets and what shape to match against.

## Scope

- Engine-agnostic: inspects proxy node metadata only; does not depend on ESLint
  or any specific runner.
- Handles three shapes:
  1. Single node pattern (`U.SomeNode({ ... })`)
  2. Disjunction (`U.or(U.A(...), U.B(...))`)
  3. From-node with type discrimination (`U.fromNode({ type: ... })`)

## Design

- **Input**: `rule` -- any value carrying a `[NODE]` proxy descriptor.
- **Output**: `Array<{ tag: string; pattern: any }>` -- one entry per visitor
  the consumer should register.

## Internal helper

`extractPattern` (singular) returns only the first entry and is intentionally
**not** part of the public API. It is available as `_extractPattern` for sibling
modules that need it.

## Examples

```ts
import { extractPatterns } from "@/runtime/extract-patterns";

const entries = extractPatterns(U.IfStatement({ test: $("cond") }));
// entries => [{ tag: "IfStatement", pattern: { test: $("cond") } }]
```
