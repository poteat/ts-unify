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

- Every non-root folder should have an `index.ts` that re-exports the public
  APIs of that folder (barrel pattern).
- The root-level `src/index.ts` defines the external interface of the package
  and should re-export only the public API intended for consumers.
- Internal utilities should remain within their concept barrels and not be
  re-exported at the root unless explicitly part of the public API.

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
