# Agent Guidelines

This repository defines agent rules and conventions. Agents working in this repo
should read this file first, then follow the documents in `.agent/`.

## Where to look

- `.agent/JSDOC_VS_SPEC.md`: JSDoc vs Spec rules (scope, style, duties). Follow
  the import graph; providers do not document their consumers.
- `.agent/META.md`: meta-rules for writing and evolving guidelines; keep
  guidance evergreen and decoupled from specific identifiers.
- `.agent/STRUCTURE.md`: code layout and barrels; one concept per folder;
  colocated tests/specs; consistent barrels; root exposes only the external API.
- `.agent/TESTING.md`: project testing patterns, including runtime and
  compile-time (type-level) tests.

## Core principles

- Keep API concepts minimal; prefer extending existing primitives over adding
  new named concepts.
- Documentation split:
  - JSDoc: short, actionable, 1–2 examples max.
  - Spec: deeper semantics, edge cases, and performance guidance.
- API design and typing:
  - Favor generic function signatures that capture the exact argument type so
    return types can precisely reflect input shapes and literals.
  - Prefer composition that defers expensive work; do deep processing once at a
    clear boundary (e.g., before execution/IO) rather than in inner helpers.
  - Keep public APIs stable and minimal; hide internals behind folder barrels.
- Documentation scope:
  - Specs follow the import graph: a module describes itself and dependencies it
    imports; it does not describe downstream consumers.

## Editing & tests

- Keep changes minimal and focused; match existing style.
- Include runtime tests and type-level tests (compile-time) where appropriate.
- Use the provided type-test helpers for exact type equality checks.
