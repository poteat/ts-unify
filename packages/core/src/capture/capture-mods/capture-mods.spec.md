# CaptureMods

## Overview

Provides the branding mechanism and modifier shape types used to attach
deferred transformations to capture tokens. These modifiers are consumed by
downstream fluent helpers (`.map`, `.default`, `.truthy`, `.when`) and do not
alter runtime matching behavior directly.

## Exports

### `CAPTURE_MODS_BRAND`

A unique symbol key used to brand a capture token with its modifier set.

### `CaptureMods<Mods>`

A branded wrapper that attaches a `Mods` record to a capture token under the
`CAPTURE_MODS_BRAND` symbol key.

```typescript
type Tagged = CaptureMods<{ map: string }>;
// { readonly [CAPTURE_MODS_BRAND]: { map: string } }
```

### Modifier Shapes

- `ModMap<New>` -- `{ map: New }` -- post-match value transformation.
- `ModDefault<Expr>` -- `{ default: Expr }` -- fallback when capture is
  `undefined`.
- `ModTruthy` -- `{ truthy: true }` -- exclude JS-falsy values.
- `ModWhen<Narrow>` -- `{ when: Narrow }` -- type-narrowing guard.

## Scope

Purely type-level branding and shape definitions. Runtime behavior is
implemented by the fluent chain helpers that inspect these brands.
