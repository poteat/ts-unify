# $ (Dollar) Function

Factory function for creating capture sentinels with literal-typed names.

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

```typescript
<const Name extends string>(name: Name) => Capture<Name>;
```

The `const` modifier ensures the name is preserved as a literal type.

## Implementation Notes

- Uses `const` type parameter for literal type preservation
- Returns a branded object with Symbol property
- Objects are frozen to prevent runtime mutations
- Minimal runtime overhead (just object creation + freeze)
