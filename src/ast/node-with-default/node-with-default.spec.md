# NodeWithDefault

Elevates a common intent — “use this default when the capture is missing” — to a
first‑class fluent helper. It keeps transformation rules declarative by hiding
the plumbing required to build a `??` and to push that type through the node.

## What and Why

- What: a fluent `.default(expr)` on nodes that capture exactly one value.
- Why: replaces boilerplate `.map(v => v ?? expr)` with a self‑describing API,
  improving rule readability and keeping types precise via normalization.

## Semantics

- Single‑capture only. If the node’s capture bag has exactly one key, the method
  is available; otherwise its parameter type becomes `never` (via an overload),
  making it unusable in multi‑capture contexts.
- Equivalent to mapping the capture through nullish coalescing:
  `.map(v => v ?? expr)`.
- The capture’s value type is replaced by the normalized type of `expr`.
  Normalization unwraps fluent wrappers, rehydrates `{ type: … }` shapes to
  concrete `TSESTree.Node` types, and collapses broad unions to the stable
  categories `Expression` or `Statement`.

## When to Use

- A node has exactly one capture and you want a default value for nullish input
  (return arguments, expression placeholders, etc.).
- You want the simplest, most descriptive form without additional mapping logic;
  otherwise prefer `.map`.

## Relationship to Other Concepts

- Built on `SubstituteSingleCapture` (structural replacement of the one capture)
  and `NormalizeCaptured` (stable typing for `expr`).
- Complements `.map`: use `.default` for the common coalescing case; use `.map`
  for arbitrary transforms or for multiple captures.

## Example

```
// ReturnStatement with a single capture in `argument`
U.ReturnStatement({ argument: $ })
  .default(U.Identifier({ name: "undefined" }));
// Conceptually: .map(v => v ?? Identifier("undefined"))
```
