# Capture Type

Core type definition for capture sentinels in pattern matching.

## Usage

```typescript
type Capture<Name extends string = string>
```

## Purpose

The `Capture` type is a branded type that marks positions in patterns where
values should be extracted. It preserves the literal string type of the name for
compile-time pattern matching and type extraction.

## Structure

```typescript
type Capture<Name> = {
  readonly [CAPTURE_BRAND]: true;
  readonly name: Name;
};
```

## Type Parameter

- `Name extends string` - The unique identifier for this capture position.
  Preserved as a literal type for compile-time extraction.

## Examples

### Type usage

```typescript
type UserId = Capture<"userId">;
type Generic = Capture; // Same as Capture<string>
```

### In patterns

```typescript
type Pattern = {
  user: {
    id: Capture<"userId">;
    name: Capture<"userName">;
  };
};
```

## Implementation Notes

- Uses a Symbol brand for runtime type checking
- Readonly properties prevent mutation
- Name is preserved as literal type for extraction
