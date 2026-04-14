# U.seq

## Overview

`U.seq(A, B, ...)` matches a contiguous subsequence of elements within an
array pattern. All captures from the constituent patterns are merged into
one bag, and an optional `.to(factory)` rewrites the matched subsequence
inline — replacing the matched elements with the factory's output.

Draws from parser combinator tradition: `seq` is sequential composition.

## Scope

- Builder utility on `U`, alongside `U.or()`, `U.fromNode()`, `U.maybeBlock()`.
- Only valid inside array patterns (e.g., `body: [...]`, `arguments: [...]`).
  Array position provides the ordering that `seq` relies on.
- Type definition in core; runtime behavior in the match engine.

## Design

- `U.seq(P1, P2, ...)` produces a proxy node with tag `"seq"` and
  `args: [P1, P2, ...]`.
- When encountered during array matching, the engine matches `P1, P2, ...`
  against consecutive elements starting at the current index.
- Captures from all constituents are merged into the parent bag as if the
  elements were matched individually.
- Without `.to()`: the seq is transparent — elements pass through to the
  output unchanged. The seq exists only to group captures.
- With `.to(factory)`: the factory receives the merged captures and returns
  a replacement value (or array of values). The matched elements are replaced
  by the factory's output in the parent array.

## Semantics

- **Matching**: `seq(P1, P2)` at array index `i` matches if `P1` matches
  element `i` and `P2` matches element `i+1`. The seq consumes
  `args.length` elements from the array.
- **Capture merging**: all captures from all constituents are merged via
  `Object.assign` into the parent bag (same as nested sub-patterns).
- **Inline rewrite**: when `.to(factory)` is present, the engine calls
  `factory(mergedBag)` and splices the result into the parent array in
  place of the consumed elements. If the factory returns an array, the
  elements are spread; if it returns a single value, it replaces the
  sequence as one element.
- **Nesting**: `seq` elements can contain captures (`$`, `$("name")`),
  proxy nodes (`U.X(...)`), spreads (`...$`), and other combinators.
  Spreads inside a `seq` are not supported (a seq matches a fixed-length
  subsequence).

## Examples

```ts
// Inline a const+usage pair. The seq matches two adjacent statements,
// merges their captures, and .to() rewrites them into one statement.
U.BlockStatement({
  body: [
    ...$("before"),
    U.seq(
      U.VariableDeclaration({
        kind: "const",
        declarations: [U.VariableDeclarator({ id: $("id"), init: $("init") })],
      }),
      $("stmt"),
    ).to(({ stmt, id, init }) => sub(stmt, id, init)),
    ...$("after"),
  ],
})
```

```ts
// Match two adjacent return statements (no rewrite, just grouping).
U.BlockStatement({
  body: [
    ...$,
    U.seq(
      U.ReturnStatement({ argument: $("a") }),
      U.ReturnStatement({ argument: $("b") }),
    ),
  ],
})
```
