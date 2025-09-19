# Comments Guidelines

This document defines how to write and maintain code comments so they stay
useful, minimal, and evergreen.

## Purpose

- Favor clear code over comments: choose good names, extract helpers, and keep
  logic small. Use comments sparingly when intent cannot be expressed in code.
- Keep comments evergreen: avoid content that will go stale with routine edits.

## Where to document what

- Code comments (this doc): short, local clarifications that code cannot express
  well; avoid narrative.
- JSDoc: concise API docs for exported symbols (what it does, key params,
  notable behavior, 1–2 focused examples).
- Specs (`*.spec.md`): deeper rationale, semantics, edge cases, and examples.

## Do (allowed/encouraged)

- Clarify non‑obvious invariants, preconditions, or guarantees that are not
  obvious from types alone.
- Note subtle constraints that affect correctness (e.g., sort order required,
  time zone normalization) and link to sources/issues when helpful.
- Document pitfalls or edge‑case behavior that future editors must not miss.
- Use TODO only when actionable, with owner/context or issue link.
- Keep comments adjacent to the code they explain; keep them brief.

## Don’t (forbidden/avoid)

- Don’t restate the code. Example: `const c = a + b; // add a and b to c`.
- Don’t write conversational or historical notes, e.g.:
  - "As requested from the user, I moved module A to its own file"
  - "Let me know if you want this changed"
  - "Optional, we can also explore it this other way"
- Don’t document downstream consumers from provider code; avoid coupling to
  specific identifiers in other modules.
- Don’t paste spec‑level prose into implementation comments; put it in the
  module spec instead.
- Don’t leave stale comments after refactors; update or delete them.

## Style

- Be precise and neutral; avoid "I/we/you". Prefer imperative mood.
- Prefer why over what when needed: explain the reason behind a non‑obvious
  choice, not the mechanics already clear in code.
- Use one line when possible; if multiple lines are needed, keep them tight.

## Examples

Bad:

```ts
// As requested from the user, I moved module A to its own file
const c = a + b; // add a and b to c
```

## Maintenance

- Treat comments as part of the API surface: keep them accurate. When behavior
  changes, update the comment or remove it. Prefer refactoring names/structure
  first if that removes the need for a comment.
