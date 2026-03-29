# NodeWithDefaultUndefined

Sugar for a common defaulting pattern: in single‑capture contexts, add
`.defaultUndefined()` to mean “use `undefined` when the capture is nullish”.

## What and Why

- What: a parameterless fluent method available only when exactly one capture
  exists. It defaults the capture to JavaScript’s canonical “missing” value.
- Why: avoids repeating `.default(Identifier("undefined"))` in rules and keeps
  intent obvious.

## Semantics

- Single‑capture: behaves like `.default(U.Identifier({ name: "undefined" }))`.
- Multi‑capture: calling `.defaultUndefined()` yields `never` (type error).
- Type result: the capture’s value type becomes the `Expression` category.

## Relationships

- Built on `SubstituteSingleCapture` and `NormalizeCaptured` via
  `SubstituteSingleCapture<Node, TSESTree.Identifier>`.
- Complements `.default(expr)` for arbitrary defaults.
