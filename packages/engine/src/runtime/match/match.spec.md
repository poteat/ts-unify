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
- `applyChainModifiers` -- post-processes a nested sub-pattern's bag based on
  chain entries `seal` and `bind`. See "Seal and bind" below.
- `deepEqual` -- structural equality ignoring `parent`, `loc`, `range` keys.
- `isCapture`, `isProxyNode`, `isSpread` -- brand checks.

## Seal and bind

Sub-patterns can carry `.seal()` and `.bind()` chain entries that post-process
their local capture bag after matching. These are runtime counterparts to the
type-level brands defined in `sealed.spec.md` and `node-with-bind.spec.md`.
`applyChainModifiers` receives the inner bag plus the embedding property key
(`parentKey`) and returns the bag the parent pattern sees.

- `.seal()`: if the inner bag has exactly one capture and a `parentKey` is
  present, re-key that single capture to `parentKey`. At the root (no
  `parentKey`) or with zero/multi captures, the bag is unchanged.

- `.bind("name")`: discard inner captures and return `{ [name]: actual }`,
  where `actual` is the matched node.

- `.bind()` (zero-arg): equivalent to `.bind("node")` + `.seal()`. Because the
  produced bag has exactly one key, the seal rule collapses this to
  `{ [parentKey]: actual }` when embedded under a property, and leaves
  `{ node: actual }` at the root. Implementation shortcut: resolve the key in
  one step as `parentKey ?? "node"`.

## Where (quantified constraints)

After structural matching and `.when()` guards succeed, `.where()` chain
entries are evaluated. Each entry carries one or more constraint patterns.
Each pattern's chain carries a quantifier (`.none()`, `.some()`, etc.) and
an optional scope modifier (`.until()`, `.global()`, `.project()`).

Supports the following quantifiers with subtree scope (+ `.until()` boundaries):

- `.none()` — reject if count > 0 (short-circuits on first match)
- `.some()` — reject if count = 0
- `.atLeast(n)` — reject if count < n
- `.atMost(n)` — reject if count > n
- `.exactly(n)` — reject if count ≠ n

Implements CTL formula `A[!P U B]` (for `.none()`) per `node-with-where.spec.md`.

### Walk behavior

- The walk starts at the matched node's children (the matched node itself
  is not checked — it's the root, not a descendant).
- Depth-first, pre-order: each descendant is checked against `P` before
  its children are visited.
- If `P` carries a `.until(B)` boundary (from `node-with-until.spec.md`),
  the walk does not recurse into descendants whose `type` matches `B`.
  The boundary node itself IS checked against `P` before being pruned.
- Keys in `SKIP_KEYS` (`parent`, `loc`, `range`) are not traversed.

### Helpers

- `applyWhere(chain, actual)` -- entry point; iterates where entries.
- `readQuantifier(chain)` -- extracts the quantifier kind and test predicate.
- `subtreeCount(root, pattern, boundary, limit?)` -- counts matches in root's
  children. Accepts an optional `limit` for early exit (used by `.none()`).
- `countDescendant(node, pattern, boundary, limit?)` -- checks one node +
  recurses, returning the match count.
- `isBoundaryNode(node, boundary)` -- type-checks against boundary pattern.

## Examples

```ts
import { match } from "@/runtime/match";

const bag = match(
  { type: "Identifier", name: "foo" },
  { name: $("n") }
);
// bag => { n: "foo" }
```
