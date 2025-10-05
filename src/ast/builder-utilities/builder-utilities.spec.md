# BuilderUtilities

Convenience helpers exposed alongside the `U` builders that improve readability
and composition of fluent rules without introducing synthetic AST kinds.

## Members

- `truthy`: Predicate helper for guards.
- `or(...nodes)`: Variadic disjunction over fluent nodes. Preserves per‑branch
  keys and coalesces capture types; branded so extraction distributes over
  branches.
- `maybeBlock(stmt)`: Accepts either the statement itself or a single‑statement
  block containing it (i.e., matches both braced and unbraced forms). Returns a
  fluent union and carries the OR brand so that extraction distributes across
  the two forms.

## Why

- Keep rules declarative and compact (intent over mechanics), especially for
  common structural alternatives like block/non‑block forms.
- Avoid synthetic node kinds while capturing ergonomic patterns at the type
  level.

## Scope

- Provider for the `U` namespace’s helper surface. Concrete helper semantics are
  defined by their own typing and consumed by downstream providers (e.g.,
  extraction/binding).
