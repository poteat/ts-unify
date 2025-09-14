# Meta Rules for Agent Guidelines

This document defines how to create and evolve agent-facing rules in this
repository, so the guidance remains clear and low-maintenance.

## Evergreen Guidance

- Prefer generic, concept-level guidance over concrete symbol names.

  - Avoid coupling rules to specific identifiers (e.g., function/type names)
    that may change; use roles like "provider module", "consumer module",
    "public primitive", or "helper".
  - If naming a concrete symbol is necessary, do so sparingly and only when it
    materially clarifies usage.

- Examples are illustrative, not normative.
  - Keep examples short and representative of patterns rather than tied to
    current filenames or identifiers.
  - If examples reference specific symbols, ensure the surrounding rule still
    makes sense if those symbols are renamed.

## Scope & Structure

- Place agent rules under `.agent/` and link them from `AGENTS.md`.
- Each document should have a narrow, clear scope (e.g., JSDoc vs Spec rules).
- Follow the import graph when discussing relationships:
  - A module spec may document dependencies it imports (providers) and how it
    uses them.
  - It should not describe downstream consumers (to avoid tight coupling).

## Change Management

- Prefer updating rules to remain evergreen instead of expanding with
  codebase-specific lists.
- When architecture changes invalidate a rule, revise or remove the rule rather
  than layering exceptions.
- Keep tests and specs aligned; if a rule conflicts with tests, open an issue
  and reconcile the intent.

## Authoring Tips

- Be concise and actionable; avoid long narrative where a checklist suffices.
- Use consistent terminology across documents (define once, reuse).
- When necessary, include a brief "Why" to capture rationale and tradeoffs.
