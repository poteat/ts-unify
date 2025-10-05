# NodeWithDefault

Provides a fluent `.default(expr)` method on nodes with exactly one capture.

## Semantics

- Single-capture only: available when the capture bag has exactly one key.
- Equivalent to `.map(v => v ?? expr)` at the type level.
- Refines the capture’s value type to the normalized type of `expr`.
  - Normalization rehydrates `type`-tagged nodes and collapses category unions
    to `TSESTree.Expression`/`TSESTree.Statement` where appropriate.

## Type Surface

```
type NodeWithDefault<Node> = Node & {
  // Single-capture overload (param enabled)
  default<Expr>(
    expr: [SingleKeyOf<ExtractCaptures<Node>>] extends [never]
      ? never
      : Expr
  ): [SingleKeyOf<ExtractCaptures<Node>>] extends [never]
    ? never
    : FluentNode<
        SubstituteCaptures<
          Node,
          BagFromSingle<ExtractCaptures<Node>, NormalizeCaptured<Expr>>
        >
      >;

  // Fallback overload (param is never)
  default(expr: never): never;
};
```

Gating: when there is not exactly one capture, the method is present but the
parameter type is `never` via an overload, making it unusable in that context.

## Examples

```
// ReturnStatement with a single capture in `argument`
U.ReturnStatement({ argument: $ })
  .default(U.Identifier({ name: "undefined" }));
// ≅ .map(v => v ?? Identifier("undefined"))
```
