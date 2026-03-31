# match

## Overview

`match(node, pattern)` attempts to match an AST node against a pattern object,
extracting captures into a "bag" (a plain record). Returns the capture bag on
success, or `null` on mismatch.

## Scope

- Engine-agnostic runtime: works with any ESTree-shaped AST, not tied to ESLint
  or any specific parser.
- Handles named captures (`$("name")`), anonymous captures (`$`), nested proxy
  nodes (typed sub-patterns), `or(...)` disjunctions, `maybeBlock(...)` sugar,
  array patterns with spread elements, and plain literal equality.

## Design

- **Inputs**: `node` (any AST-like object) and `pattern` (a plain object
  possibly containing capture sentinels, proxy nodes, arrays, and literals).
- **Output**: `Record<string, any> | null` -- the capture bag or `null`.
- Duplicate named captures are validated via structural `deepEqual`; if the same
  name binds to structurally different values, the match fails.

## Helpers (private)

- `matchInner` -- recursive object-key matching.
- `matchValueInner` -- single-value matching (captures, proxy nodes, literals).
- `matchArrayInner` -- array matching with 0, 1, or 2 spread elements.
- `matchOrInner` -- left-to-right disjunction over branches.
- `matchMaybeBlockInner` -- unwraps single-statement `BlockStatement` or matches
  directly.
- `deepEqual` -- structural equality ignoring `parent`, `loc`, `range` keys.
- `isCapture`, `isProxyNode`, `isSpread` -- brand checks.

## Examples

```ts
import { match } from "@/runtime/match";

const bag = match(
  { type: "Identifier", name: "foo" },
  { name: $("n") }
);
// bag => { n: "foo" }
```
