# Code Structure Guidelines

This document defines how code in the repository is organized so that features
are easy to find, test, and document consistently.

## Folder-Per-Concept

- Each distinct concept lives in its own folder under `src/` (e.g., `capture/`,
  `pattern/`, `extract-captures/`).
- Subfolders may be used to group closely-related pieces (e.g.,
  `capture/dollar/`).

## Leaf Folder Contents

Leaf-level concept folders (no further sub-concepts) should contain:

- `index.ts` — barrel re-exports for that folder.
- `X.ts` — the implementation file(s) for the concept (one or more if needed).
- `X.test.ts` — colocated Jest tests.
- `X.spec.md` — a spec describing semantics and design for the concept.

Notes:

- When a concept has multiple implementations (e.g., several small utilities),
  group related specs into a single `*.spec.md` or keep one per utility — be
  consistent within the folder.
- Tests and specs should mirror the exported surface (public APIs first).

## Barrels

- Every non-root folder should have an `index.ts` barrel that re-exports the
  folder's public API using `export * from "./file"` form for simplicity.
- The root-level `src/index.ts` defines the external interface of the package
  and should re-export only the public API intended for consumers.
- Internal utilities remain within their concept barrels and are not re-exported
  at the root unless explicitly part of the public API.

## Imports

- Configure path aliases so `@/` points to `src/` (set in `tsconfig` and Jest).
- Use `@/…` when importing from a parent or sibling folder (avoid `../…`).
- Use `./…` for same-folder or deeper relative imports.
- Prefer importing from a concept's top-level barrel when available (e.g.,
  `@/capture` instead of `@/capture/dollar`). Use deep paths only for internals
  that are intentionally not exported by the top-level barrel.

## Naming

- Use lowercase kebab-case for filenames (e.g., `dollar.ts`,
  `finalize-captures.ts`).
- Keep test/spec filenames aligned with their subject (e.g., `dollar.test.ts`,
  `dollar.spec.md`).

## Tests

- Prefer colocated Jest tests named `*.test.ts` under the same folder as the
  implementation.
- Use `assertType` and related helpers for compile-time behavior checks.
- Keep array/tuple type-equality tests conservative to avoid brittleness.

## Specs

- Co-locate `*.spec.md` with the concept code.
- Follow the import graph: document providers; avoid documenting downstream
  consumers unless the concept explicitly exports integration points for them.
