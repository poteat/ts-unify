# createRule

## Overview

`createRule(transform, opts?)` compiles a fluent AST transform (a
`TransformLike` value) into an ESLint `RuleModule`. This is the primary bridge
between ts-unify's pattern language and the ESLint rule API.

## Scope

- Extracts entry patterns from the transform's proxy trace via
  `extractPatterns`.
- Registers one ESLint visitor per distinct tag among the extracted
  `{ tag, pattern, chain }` entries. Entries sharing a tag (two same-typed
  branches of a root `U.or`) are tried in order and the first match wins,
  as `U.or` does for nested patterns; one report per node at most.
- Each visitor calls `matchWithSites(node, pattern, chain)` at runtime and,
  on success, calls `context.report` with the captured data. A `.when()`,
  `.where()` or `.config()` on a root `U.or` reaches each branch's chain via
  `extractPatterns`, so a root guard runs after whichever branch matched.
- When `opts.fix` is `true` and the transform carries a `.to(factory)` chain
  entry, the rule additionally supplies a `fix` function that reifies the
  factory output and replaces the matched node's text.
- A `Comment` entry has no ESLint visitor of its own. The rule visits
  `Program` and runs the entry over `commentNodes(program)` from
  `@ts-unify/engine`, which reads the `comments` and `tokens` the ESLint
  parser leaves on the AST. A comment report carries the comment's `loc`, so
  ESLint highlights the comment itself. A `Program` entry in the same rule
  runs before the comment entries.

## Inputs

| Parameter   | Type                              | Description                       |
|-------------|-----------------------------------|-----------------------------------|
| `transform` | `TransformLike`                   | Fluent AST pattern (e.g. from `U`).|
| `opts.message` | `string` (default `"Matches a ts-unify pattern"`) | Human-readable lint message. |
| `opts.fix`  | `boolean` (default `false`)       | Enable auto-fix via `.to()` chain.|

## Output

A `RuleModule` with:

- `meta.type` = `"suggestion"`
- `meta.fixable` = `"code"` when fix is enabled
- `meta.messages` = `{ match: <message> }`
- `create(context)` returning a visitor map

## Design details

- Each tag's visitor holds a dispatcher (the engine's `dispatcherOf`) over
  the rule's entries of that tag: a node reads the entries' root literals
  once and only the entries those admit are matched, in order.
- Captures are stringified for the `data` bag passed to `context.report`.
  `Identifier` nodes use their `.name`; everything else uses `String(v)`.
- Fix generation uses `applyRewrites` followed by `printNode` to produce the
  replacement text; `printNode` maps typescript-estree v8 field names to the
  ones recast's TypeScript printer reads.

## Examples

```ts
import { createRule } from "@ts-unify/eslint";
import { U, $ } from "@ts-unify/core";

const rule = createRule(U.Identifier({ name: $("n") }), {
  message: "Found identifier {{n}}",
});

// rule.meta.type === "suggestion"
// rule.meta.messages.match === "Found identifier {{n}}"
```
