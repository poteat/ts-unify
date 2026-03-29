# AstTransform

## Overview

`AstTransform<In, Out, Cfg>` is the terminal descriptor produced by `.to(...)` on
a `FluentNode`. It contains:

- `from: In` — the input pattern shape
- `to: (bag: ExtractCaptures<In>) => Out` — a factory that maps the capture bag
  to a concrete output AST node `Out`.
- `importMap?` — declares imports the transform requires.
- `config(defaults)` — provides default values for config slots (`C`).

## Semantics

- Not a `Pattern`: cannot be embedded in pattern positions; this enforces
  root-only usage of `.to`.
- `Out` is intended to be a concrete AST node shape (e.g., `NodeByKind[...]`)
  without capture tokens; builders can construct these nodes.

## Imports

`.imports(map)` declares imports the transform needs. Keys are import specifiers,
values are module paths (or `C()` config slots for configurable paths).

Import specifier key format:
- `"foo"` → `import { foo } from "..."`
- `"foo as Bar"` → `import { foo as Bar } from "..."`
- `"default as foo"` → `import foo from "..."`
- `"* as foo"` → `import * as foo from "..."`

## Configuration

`C("name")` marks a value position as user-configurable. Config slots in
`.imports()` are constrained to `string`. The `Cfg` type parameter accumulates
config slots through the fluent chain, and `.config(defaults)` provides default
values constrained to the accumulated shape.

## Examples

```ts
// Basic transform
const rule = U.ReturnStatement({ argument: $("arg") })
  .to(({ arg }) => U.ExpressionStatement({ expression: arg }));

// With configurable import path
const rule = U.ArrayExpression({ ... })
  .to(({ array }) => U.CallExpression({ callee: U.Identifier({ name: "uniq" }), arguments: [array] }))
  .imports({ uniq: C("from") })
  .config({ from: "lodash/uniq" });
```
