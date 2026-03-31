# createPlugin

## Overview

`createPlugin(rules, opts?)` assembles a map of named transforms into an ESLint
plugin object. Each entry is compiled via `createRule` and namespaced under a
configurable prefix.

## Inputs

| Parameter     | Type                              | Description                          |
|---------------|-----------------------------------|--------------------------------------|
| `rules`       | `Record<string, TransformLike>`   | Named transforms to expose as rules. |
| `opts.prefix` | `string` (default `"ts-unify"`)   | Namespace prefix for rule keys.      |

## Output

`{ rules: Record<string, RuleModule> }` -- a standard ESLint plugin shape.

Each key in the output `rules` map is `"<prefix>/<name>"`, and each value is the
`RuleModule` produced by `createRule(transform, { message: "ts-unify: <name>" })`.

## Design

- Iterates `Object.entries(rules)` and delegates to `createRule` for each.
- The default message is `"ts-unify: <name>"` so lint output identifies which
  rule fired.
- Returns a plain object with a single `rules` property, matching ESLint's
  plugin protocol.

## Examples

```ts
import { createPlugin } from "@ts-unify/eslint";
import { U, $ } from "@ts-unify/core";

const plugin = createPlugin({
  "no-var": U.VariableDeclaration({ kind: "var" }),
  "prefer-const": U.VariableDeclaration({ kind: "let" }),
});

// plugin.rules["ts-unify/no-var"]       -- RuleModule
// plugin.rules["ts-unify/prefer-const"] -- RuleModule
```
