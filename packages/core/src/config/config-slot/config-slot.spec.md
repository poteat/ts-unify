# C (Config Slot Factory)

Factory function for creating config slot sentinels.

## Usage

```typescript
const slot = C("theme");
```

## Purpose

`C` creates a frozen `ConfigSlot` object with the given name. It is the
config counterpart to `$` for captures. The returned object carries the
`CONFIG_BRAND` symbol and is frozen to prevent mutation.

## Signature

```typescript
interface C {
  <const Name extends string>(name: Name): ConfigSlot<Name, unknown>;
}
```

## Examples

### Creating config slots

```typescript
import { C } from "ts-unify";

const theme = C("theme");
// { [CONFIG_BRAND]: true, name: "theme" }

const maxRetries = C("maxRetries");
// { [CONFIG_BRAND]: true, name: "maxRetries" }
```

### Using in output patterns

```typescript
const output = {
  settings: {
    theme: C("theme"),
    maxRetries: C("maxRetries"),
  },
};
```

## Implementation Notes

- Returns a frozen object with `CONFIG_BRAND` set to `true`
- Preserves the literal string type of the name via `const` type parameter
- The `value` property is omitted at runtime (only exists in the type)
