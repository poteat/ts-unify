# AstTransform

## Overview

`AstTransform<In, Out>` is the terminal descriptor produced by `.to(...)` on a
`FluentNode`. It contains:

- `from: In` — the input pattern shape
- `to: (bag: ExtractCaptures<In>) => Out` — a factory that maps the capture bag
  to a concrete output AST node `Out`.

## Semantics

- Not a `Pattern`: cannot be embedded in pattern positions; this enforces
  root-only usage of `.to`.
- `Out` is intended to be a concrete AST node shape (e.g., `NodeByKind[...]`)
  without capture tokens; builders can construct these nodes.

## Examples

```ts
type T = AstTransform<
  { type: "ReturnStatement"; argument: Capture<"arg", string> },
  { type: "ReturnStatement"; argument: { type: "Literal"; value: string } }
>;
// T = { from: In; to: (bag: { arg: string }) => Out }
```
