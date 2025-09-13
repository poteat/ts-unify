# HasNever

Checks if a type is `never`, useful for validation logic.

## Usage

```typescript
type IsNever1 = HasNever<never>; // true
type IsNever2 = HasNever<string>; // false
type IsNever3 = HasNever<string | never>; // false
```

## Purpose

TypeScript's `never` type represents values that never occur. This utility helps
detect when a type has been narrowed to `never`, which is useful for:

- Validation in conditional types
- Detecting impossible type intersections
- Error handling in type-level programming

## Examples

### Basic never detection

```typescript
type Empty = HasNever<never>; // true
type NotEmpty = HasNever<number>; // false
```

### Union handling

```typescript
type Union = HasNever<string | never>; // false (never is absorbed)
type JustNever = HasNever<never>; // true
```

### Intersection validation

```typescript
type Impossible = string & number;
type IsImpossible = HasNever<Impossible>; // true
```

## Implementation Note

Uses tuple wrapping `[T]` to prevent distribution over unions.
