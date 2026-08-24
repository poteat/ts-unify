---
name: verify
description: Build the ts-unify packages and drive a change through ESLint on a real file, observing reports rather than running tests.
---

# Verify ts-unify

Surface: the ESLint plugin. A rule written with `U`/`$` is compiled by
`createPlugin` and run by the `eslint` CLI over a sample file.

## Build

```bash
npm run build                         # core, engine, rules, eslint
npm run build -w packages/runner      # eslint imports @ts-unify/runner at runtime
```

## Drive

Use a consumer project that links the packages and has `eslint` plus
`@typescript-eslint/parser` installed (for example `~/code/atp/cci-linting`,
whose `node_modules/@ts-unify/*` symlink to this repo's packages). ESLint
ignores files outside its cwd, so write the sample and config inside it:

```js
// <consumer>/.verify-tmp.config.js
import tsParser from "@typescript-eslint/parser";
import { createPlugin } from "@ts-unify/eslint";   // createRule is under /internal
import { U, $ } from "@ts-unify/core";
const detached = U.Comment({ kind: "jsdoc", attachedTo: null }).message("detached jsdoc");
export default [{ files: ["**/*.ts"], languageOptions: { parser: tsParser },
  plugins: { v: createPlugin({ detached }) }, rules: { "v/detached": "error" } }];
```

```bash
npx eslint --no-config-lookup -c .verify-tmp.config.js --format json .verify-sample.ts
```

Read `line:column-endLine:endColumn` per message: a comment report must span
the comment itself. Remove the temp files afterwards.

## Gotchas

- Jest needs `--watchman=false` on this machine.
- The runner's `tsconfig.json` typecheck fails on `@/` aliases; the build
  (`tsconfig.build.json`) is fine.
