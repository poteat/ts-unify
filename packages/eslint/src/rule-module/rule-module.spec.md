# RuleModule

## Overview

`RuleModule` is the structural type describing an ESLint rule object produced by
`createRule`. It mirrors the subset of ESLint's native rule shape that ts-unify
actually relies on, keeping the package independent of `@typescript-eslint/utils`
at the type level.

## Design

- **`meta.type`** -- always `"suggestion"`.
- **`meta.fixable`** -- optional, `"code"` when the rule carries an auto-fix.
- **`meta.messages`** -- a `Record<string, string>` keyed by message ID (the
  only ID used today is `"match"`).
- **`create(context)`** -- receives a minimal `RuleContext` and returns a visitor
  map (`Record<string, (node) => void>`).

## Supporting types (private)

- `RuleContext` -- subset of ESLint's context: `report()`, `sourceCode` /
  `getSourceCode()`.
- `RuleFixer` -- `replaceText(node, text)`.
- `RuleFix` -- `{ range, text }`.

## Examples

```ts
import type { RuleModule } from "@ts-unify/eslint";

const rule: RuleModule = {
  meta: { type: "suggestion", messages: { match: "example" } },
  create(context) {
    return {
      Identifier(node) {
        context.report({ node, messageId: "match" });
      },
    };
  },
};
```
