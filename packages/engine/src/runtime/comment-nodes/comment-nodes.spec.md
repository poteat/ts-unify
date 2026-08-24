# commentNodes

## Overview

`commentNodes(program)` turns the comments a parser keeps beside the tree into
`CommentNode` values, in source order, so they can be matched like nodes.
`commentNodeOf(program, raw)` returns the node view of one raw comment.

## Scope

- Consumer of `CommentNode` from `@ts-unify/core`: this module builds the
  values that type describes.
- Reads `program.comments` and `program.tokens`, as produced by a parser run
  with `comment: true` and `tokens: true`. Without `tokens`, no comment
  attaches to anything.
- Does not decide where comments are visited; the match and the rule
  compilers call it.

## Design

- Built once per program object and cached in a `WeakMap`, so a file's
  comments are parsed and attached once however many patterns run over them.
- Attachment uses the token list, not the tree alone: the first token after
  the comment may be a closing brace or an operator, which starts no node. A
  nearest-following-node rule would skip past such tokens and attach the
  comment to code it does not precede.
- The outermost declaration at that token wins, so a documented
  `export function f` attaches to the `ExportNamedDeclaration`, and a pattern
  on `attachedTo` unwraps the export itself when it wants the function.

## Semantics

- `kind` and the JSDoc parts follow `CommentNode`'s spec.
- `attachedTo` is the outermost node in the declaration set whose range starts
  at the first token whose start is at or after the comment's end; `null`
  when there is no such token, or no declaration starts there.
- `header` is `true` for the first comment in `program.comments` when it ends
  at or before the first token's start (or there are no tokens).
- `loc` and `range` are the raw comment's; `parent` is the program.

## Examples

```ts
const ast = parse(code, { comment: true, tokens: true, loc: true, range: true });
for (const c of commentNodes(ast)) {
  if (c.kind === "jsdoc" && c.attachedTo === null) report(c.loc);
}
```
