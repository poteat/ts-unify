# createRule

## Overview

`createRule(transform, opts?)` compiles a fluent AST transform (a
`TransformLike` value) into an ESLint `RuleModule`. This is the primary bridge
between ts-unify's pattern language and the ESLint rule API.

## Scope

- Extracts entry patterns from the transform's proxy trace via
  `extractPatterns`.
- Registers one ESLint visitor per extracted `{ tag, pattern }` entry.
- Each visitor calls `match(node, pattern)` at runtime and, on success, calls
  `context.report` with the captured data.
- When `opts.fix` is `true` and the transform carries a `.to(factory)` chain
  entry, the rule additionally supplies a `fix` function that reifies the
  factory output and replaces the matched node's text.

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

- Captures are stringified for the `data` bag passed to `context.report`.
  `Identifier` nodes use their `.name`; everything else uses `String(v)`.
- Fix generation uses `reify(output, sourceCode)` followed by `recast.print` to
  produce the replacement text.

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
