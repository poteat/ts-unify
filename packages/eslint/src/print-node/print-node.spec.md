# printNode

## Overview

`printNode(node)` turns an ESTree node into source text with recast's
printer. It is the one place the ESLint package hands nodes to recast.

## Scope

- Accepts nodes in typescript-estree v8 shape, whether parsed by ESLint or
  built by a `.to()` factory.
- Does not mutate its input: ESLint owns the parsed AST, and rewritten trees
  share subtrees with it.

## Design

- recast's TypeScript printer reads field names from an older AST: on
  `TSTypeReference`, `TSTypeQuery`, `TSImportType` and expressions it reads
  `typeParameters` where typescript-estree v8 has `typeArguments`; on
  `TSFunctionType`, `TSConstructorType`, `TSCallSignatureDeclaration`,
  `TSConstructSignatureDeclaration` and `TSMethodSignature` it reads
  `typeAnnotation` where v8 has `returnType`. Printing v8 nodes directly
  drops type arguments silently and throws on function types.
- The node is copied (skipping `parent`, `loc`, `range`, `tokens`,
  `comments`) and each copy carries both names where they differ. recast
  already reads `params` before `parameters`, so that pair needs nothing.
- recast's upstream printer (0.24.0) still reads the old names, so the
  mapping lives here rather than in a version bump.
- The copy carries no source positions, so recast's `print` finds no
  original text to reuse at any node and prints as `prettyPrint` does,
  after a search per node for it. `prettyPrint` is used, except for a
  tree whose text holds whitespace other than spaces and line ends (a
  tab at the start of a line inside a template): `print` keeps such a
  character where `prettyPrint` writes spaces, so `print` is used there.

## Semantics

- `typeArguments` present and `typeParameters` absent: `typeParameters` is
  set to the same value, except on `CallExpression`, `OptionalCallExpression`
  and `NewExpression`, where recast reads `typeArguments` itself.
- On the five signature kinds above, `returnType` present and
  `typeAnnotation` absent: `typeAnnotation` is set to the same value.
- All other fields are copied as they are.

## Examples

```ts
printNode(parse("type T = ReturnType<typeof f>").body[0]);
// => "type T = ReturnType<typeof f>;"
printNode(parse("type F = (x: string) => string").body[0]);
// => "type F = (x: string) => string;"
```
