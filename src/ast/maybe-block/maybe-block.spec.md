# MaybeBlockCombinator

Type‑level combinator that accepts a statement pattern and returns a fluent
union that matches either the statement itself or a single‑statement
`BlockStatement` containing it.

## What and Why

- What: `maybeBlock(stmt)` ≅ `or(BlockStatement({ body: [stmt] }), stmt)`.
- Why: many code shapes come in both braced and unbraced forms. This helper
  keeps rules concise and declarative without repeating two branches.

## Semantics

- Input: a statement `S` (fluent node or pattern).
- Output: a fluent node whose underlying node type is `S | BlockStatement<[S]>`.
- Branding: carries the OR brand so extraction distributes over the two forms;
  capture names and types are preserved and coalesce as usual.

## Relationships

- Lives under `BuilderUtilities` as `U.maybeBlock`.
- Built on `UnwrapFluent`, `NodeByKind`, and `WithoutInternalAstFields` to shape
  the block form without introducing synthetic kinds.

