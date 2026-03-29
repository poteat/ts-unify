# ConfigSlot Type

Core type definition for config slot sentinels in pattern output.

## Usage

```typescript
type ConfigSlot<Name extends string = string, Value = unknown>
```

## Purpose

The `ConfigSlot` type is a branded type that marks positions in patterns or
output where values should be injected from user-supplied configuration.
It is the configuration counterpart to `Capture`, which extracts values from
matched source. `ConfigSlot` preserves the literal string type of the name
and an optional value type for compile-time extraction.

## Structure

```typescript
type ConfigSlot<Name, Value> = {
  readonly [CONFIG_BRAND]: true;
  readonly name: Name;
  readonly value?: Value;
};
```

## Type Parameters

- `Name extends string` - The unique identifier for this config position.
  Preserved as a literal type for compile-time extraction.
- `Value` - The expected type of the configured value. Defaults to `unknown`.

## Examples

### Type usage

```typescript
type Theme = ConfigSlot<"theme", string>;
type Generic = ConfigSlot; // Same as ConfigSlot<string, unknown>
```

### In output patterns

```typescript
type Output = {
  settings: {
    theme: ConfigSlot<"theme", string>;
    maxRetries: ConfigSlot<"maxRetries", number>;
  };
};
```

## Implementation Notes

- Uses a Symbol brand (`CONFIG_BRAND`) for runtime type checking
- Readonly properties prevent mutation
- Name is preserved as literal type for extraction
- Value type defaults to `unknown` when not specified
