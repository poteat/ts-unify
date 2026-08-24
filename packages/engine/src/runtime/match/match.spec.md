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
  array patterns with spread elements, plain literal equality, and string
  predicates (`U.string.*`, or a bare `RegExp`) on string positions.
- Matches comments: a `Comment` node (see `comment-nodes`) matches
  `U.Comment(...)` like any node, and a raw parser comment found under a
  `Program` being matched is seen through its node view.

## Design

- **Inputs**: `node` (any AST-like object) and `pattern` (a plain object
  possibly containing capture sentinels, proxy nodes, arrays, and literals,
  or a root proxy such as `U.Identifier({ name: $ })`). A root proxy is
  matched as a nested one would be: its tag is checked against `node.type`
  and its own chain (`.when()`, `.seal()`, `.bind()`, `.to()`) applies.
- **Output**: `Record<string, any> | null` -- the capture bag or `null`.
- Duplicate named captures are validated via structural `deepEqual`; if the same
  name binds to structurally different values, the match fails.

## Plans

A pattern is read once into a plan, and the plan is what a match runs:
`planOf(value)` tells a capture, a config slot, a string predicate, a proxy,
a fields record or a literal apart by their brands, `proxyPlanOf(proxy)`
reads a proxy's tag, arguments and chain through its `NODE` symbol, and
`chainPlanOf(chain)` reads the `.when()` guards, `.bind()`, `.seal()`,
`.to()`, `.config()` and `.where()` entries into one record. Plans are kept
in `WeakMap`s by the pattern object, the proxy and the chain, so a rule
compiled once and matched against every node of a file reads its brands,
its proxies and its chains once, not per node. A `RegExp` in a string
position becomes one predicate at planning, with the same reset of
`lastIndex` per test.

An array is an array pattern under a property of a fields record
(`fieldPlanOf`) and a fields record with index keys anywhere else
(`planOf`), as the matchers read it either way.

## Helpers (private)

- `matchFields` -- object-key matching over a fields plan; `matchInner` is
  the same over a record.
- `matchPlan` -- single-value matching over a plan (captures, proxy nodes,
  literals); `matchValueInner` the same over a pattern value.
- `matchArrayPlan` -- array matching with 0, 1, or 2 spread elements over an
  array plan; `matchArrayInner` the same over an array pattern.
- `matchOrPlans` -- left-to-right disjunction over branches.
- `matchMaybeBlockPlan` -- unwraps single-statement `BlockStatement` or
  matches directly.
- `applyChainModifiers` -- post-processes a nested sub-pattern's bag based on
  chain entries `seal` and `bind`. See "Seal and bind" below.
- `deepEqual` -- structural equality ignoring `parent`, `loc`, `range` keys.
- String predicates are recognised with core's `isStringPredicate` and
  applied with `testString`; non-strings never match. See
  `string-predicate.spec.md` in core.
- `isCapture`, `isProxyNode`, `isSpread`, `isRawComment` -- brand and shape
  checks.

## Comments

- A value whose `type` is `"Comment"` matches a `Comment` pattern directly;
  callers that visit comments (rule compilers) pass the nodes from
  `commentNodes(program)`.
- When the root `node` is a `Program`, its raw `comments` entries (`Line`,
  `Block`) matched against a `Comment` pattern are replaced by their node view
  from `commentNodeOf(program, raw)`, so
  `U.Program({ comments: [...$, U.Comment({ kind: "jsdoc" }), ...$] })` reads
  as written. A raw comment met outside a `Program` match has no view and
  matches nothing.
- A spread over `comments` captures the raw entries, untouched.

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

- `applyConstraints(constraints, actual)` -- entry point over a chain plan's
  constraints; `applyWhere(chain, actual)` the same over a chain.
- `readQuantifier(chain)` -- extracts the quantifier kind and test predicate
  into the plan.
- `countChildrenOf(node, plan, limit, at)` -- counts matches in the node's
  children. Accepts an optional `limit` for early exit (used by `.none()`).
- `countDescendantOf(node, plan, limit, at)` -- checks one node + recurses,
  returning the match count; one context serves the whole count.
- A boundary is the set of node types its `.until()` proxy names, read into
  the plan; `isBoundaryNode(node, boundary)` reads it from the proxy.

## Examples

```ts
import { match } from "@/runtime/match";

const bag = match(
  { type: "Identifier", name: "foo" },
  { name: $("n") }
);
// bag => { n: "foo" }
```
