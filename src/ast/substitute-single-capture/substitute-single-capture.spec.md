# SubstituteSingleCapture

Convenience alias for substituting exactly one capture's value type in a node
shape with the normalized type of an expression.

## Definition

```
type SubstituteSingleCapture<Node, Expr> = SubstituteCaptures<
  Node,
  {
    [K in SingleKeyOf<ExtractCaptures<Node>> & keyof ExtractCaptures<Node>]: NormalizeCaptured<Expr>
  }
>;
```

- `NormalizeCaptured<V>` unwraps `FluentNode`, rehydrates `{ type: … }` to the
  concrete `TSESTree.Node` interface for that tag, and collapses category unions
  to `TSESTree.Expression`/`TSESTree.Statement`.
- Gate usage at the call site (e.g., with `SingleKeyOf`) to ensure there is
  exactly one capture; the alias itself does not enforce this.

## Rationale

- Centralizes normalization logic previously duplicated across fluent helpers.
- Keeps single‑capture refinement readable where used (e.g., `.default`,
  single‑capture `.map`).

