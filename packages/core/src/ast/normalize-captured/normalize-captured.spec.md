# NormalizeCaptured

Make arbitrary “things that look like AST nodes” behave like the category types
they represent, independent of how they’re spelled in types.

## What and Why

- What: a type‑level normalizer for values that will be substituted into
  captures or used in templates. It produces a stable `Expression` or
  `Statement` category where appropriate.
- Why: callers might pass fluent nodes, `{ type: … }` shapes, or already
  rehydrated nodes. Consumers shouldn’t need to care which form was used — they
  just need a consistent category type.

## Semantics

- Unwrap fluent wrappers (accept both fluent and plain node shapes).
- If a `{ type: Tag }` is provided, rehydrate that to the concrete node
  interface.
- Collapse broad unions to the category types `TSESTree.Expression` or
  `TSESTree.Statement` so downstream helpers don’t accumulate overly specific
  unions.

## Role and Relationships

- Used by `SubstituteSingleCapture` and `NormalizeBag` to stabilize the types
  they propagate.
- A shared provider used by fluent helpers like `.map` and `.default` to keep
  their semantics clean and focused.
