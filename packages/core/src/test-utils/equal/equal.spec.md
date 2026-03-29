# Equal Type Specification

## Overview

`Equal<A, B>` performs exact type equality checking using TypeScript's variance
rules to distinguish between types that would normally be considered assignable
to each other.

## Implementation Strategy

The type uses function parameter variance to create a distinction between
types:

```typescript
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? true
  : false;
```

## Why This Works

### Variance in Function Parameters

TypeScript uses **variance** to determine type compatibility:

- **Covariance**: `A extends B` means A is a subtype of B
- **Contravariance**: Function parameters are contravariant
- **Invariance**: The combination creates a strict equality check

### The Mechanism

1. Creates two generic function signatures with conditional types
2. These functions differ only if A and B are different types
3. The `extends` check between them succeeds only for exact matches

## Test Cases

### Exact Matches (returns true)

```typescript
Equal<string, string>; // true
Equal<42, 42>; // true
Equal<{ a: string }, { a: string }>; // true
Equal<any, any>; // true
Equal<unknown, unknown>; // true
Equal<never, never>; // true
```

### Near Misses (returns false)

```typescript
Equal<string, "hello">; // false - string vs literal
Equal<{ a: string }, { a: string; b?: number }>; // false - different shapes
Equal<number, number | string>; // false - type vs union
Equal<any, unknown>; // false - any vs unknown
Equal<string | number, number | string>; // false - order matters in unions*
```

\*Note: Union order sensitivity is a TypeScript limitation

### Subtypes (returns false)

```typescript
Equal<"hello", string>; // false - literal is subtype of string
Equal<42, number>; // false - literal is subtype of number
Equal<[], any[]>; // false - tuple is subtype of array
```

## Use Cases

1. **Type Testing**: Ensure types match exactly in tests
2. **Type Assertions**: Build compile-time type assertions
3. **Generic Constraints**: Validate generic type parameters
4. **Type Guards**: Create precise type narrowing utilities

## Limitations

1. **Union Order**: `string | number` ≠ `number | string` (TypeScript
   limitation)
2. **Object Property Order**: Generally handled correctly by TypeScript
3. **Function Overloads**: May not distinguish between different overload
   signatures

## Related Concepts

- TypeScript's structural type system
- Variance and type compatibility
- Conditional types
- Generic type parameters
