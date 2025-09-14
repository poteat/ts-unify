# Documentation Guidelines: JSDoc vs Spec

This repo uses two complementary documentation layers:

1. JSDoc (inline API docs)
2. Spec files (`*.spec.md`, adjacent to feature code)

The goals are: keep API docs quick to scan in editors, and capture deeper
semantics, rules, and rationale in specs that evolve with the design.

## JSDoc

- Audience: API consumers (callers) at the point of use.
- Length: concise — aim for 6–10 lines per public API.
- Include:
  - One-sentence purpose and high-level behavior.
  - Signature intent: generics, key params, return shape.
  - Notable runtime behavior (e.g., freezing, branding) and errors.
  - 1–2 focused examples that mirror common usage.
  - Tags: `@typeParam`, `@param`, `@returns`, `@throws`, `@example`.
- Keep internal helpers tagged `@internal` to reduce editor noise.

Recommended targets for JSDoc:

- Key public primitives (functions, types, classes) that users import.
- Common entry points and helpers that appear in examples or quickstarts.

## Spec Files (`*.spec.md`)

- Audience: contributors and advanced users.
- Content: design & semantics, edge cases, and performance guidance.
- Include:
  - Formal semantics and naming rules (e.g., placeholder naming derived from a
    containing field name or a tuple index).
  - Dependency-graph rule: a spec may describe dependencies it imports
    (providers) and how it uses them, but should not describe its consumers.
    - Example: a provider module's spec documents its own semantics and naming
      conventions, but does not mention downstream consumers. A consumer
      module's spec may mention the provider because it imports and interprets
      it.
  - Runtime semantics (e.g., unification of repeated names, deep equality).
  - Rationale, tradeoffs, and non-goals.
  - Links or code blocks that align with tests; prefer mirroring real test
    cases.

## Style & Placement

- Co-locate specs with the feature code directory when possible (e.g.,
  `src/capture/dollar/dollar.spec.md`).
- Keep examples in JSDoc minimal; move extended walkthroughs to specs.
- Performance guidance belongs in specs; a short pointer may appear in JSDoc
  when crucial to correct usage.

## Enforcement & Tooling

- Codex CLI agents read `AGENTS.md`. This repository uses a root `AGENTS.md` to
  point to the `.agent/` folder for detailed rules like this document.
- There is no automatic enforcement in the build. Optional future additions:
  Typedoc/ESLint rules to enforce JSDoc presence/format.
