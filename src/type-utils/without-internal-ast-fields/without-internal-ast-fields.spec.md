# WithoutInternalAstFields

## Overview

`WithoutInternalAstFields<T>` removes ESTree bookkeeping fields (`parent`,
`loc`, `range`) from each member of a type `T`. It is typically used on unions
of AST node shapes from `@typescript-eslint` before exposing them through public
APIs.

## Semantics

- Distributes over unions: each member of `T` is processed separately.
- Produces an `Omit<T, "parent" | "loc" | "range">` for every branch.
- Leaves other properties untouched.
- Works for non-union inputs as the single-member case.

## Examples

```ts
type Input = {
  type: AST_NODE_TYPES.ReturnStatement;
  argument: Expression | null;
  parent: Node;
  loc: SourceLocation;
  range: Range;
};

type Output = WithoutInternalAstFields<Input>;
// { type: AST_NODE_TYPES.ReturnStatement; argument: Expression | null }

type Union = ReturnStatement | ConditionalExpression;
type OutUnion = WithoutInternalAstFields<Union>;
// removes bookkeeping fields from both members
```
