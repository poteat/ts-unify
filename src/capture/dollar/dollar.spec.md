# $ (Dollar) Function

Factory function for creating capture sentinels with literal-typed names. Also
serves as an implicit sentinel when referenced as the bare `$` value at the type
level (e.g., `typeof $`).

## Usage

```typescript
const capture = $("captureName");
```

## Purpose

The `$` function provides a concise way to create capture sentinels in patterns.
It preserves the literal type of the name string for compile-time type
extraction.

## Examples

### Basic usage

```typescript
const userId = $("userId");
const userName = $("userName");
```

### In patterns

```typescript
const pattern = {
  user: {
    id: $("userId"),
    name: $("userName"),
    age: $("userAge"),
  },
};
```

### Array patterns

```typescript
const arrayPattern = [$("first"), $("second"), $("third")];
```

## Type Signature

```ts
type $ = <const Name extends string, Value = unknown>(
  name: Name
) => Capture<Name, Value>;
```

- `Name` is preserved as a string literal type via the `const` type parameter.
- `Value` is optional and defaults to `unknown`. You can provide it explicitly
  using `$<"name", Value>("name")`.

## Implementation Notes

- Uses `const` type parameter for literal type preservation
- Returns a branded object with Symbol property
- Objects are frozen to prevent runtime mutations
- Minimal runtime overhead (just object creation + freeze)
- Passing an empty string at runtime throws an error

## Implicit Sentinel (typeof $)

- In object patterns, `typeof $` at property `K` implies capture name `K`.
- In tuple/array patterns, `typeof $` at position `i` implies name `${i}`.
- At the root, bare `$` has no key context; consumers may reject or ignore it.
