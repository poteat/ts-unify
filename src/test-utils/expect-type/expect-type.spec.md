# ExpectType Specification

## Overview

`expectType(value).toBe(expected)` is a type-safe expectation helper that combines compile-time type checking with runtime Jest assertions. It ensures exact type equality between the value and expected result.

## Implementation

The function returns an object with a `toBe` method that uses conditional types:

```typescript
expectType<T>(value: T) => ({
  toBe: <U>(expected: Equal<T, U> extends true ? U : never) => {
    expect(value).toBe(expected);
    return expected;
  }
})
```

## How It Works

1. **Initial Call**: `expectType(value)` captures the type `T` of the value
2. **Type Constraint**: `toBe` method only accepts values of exactly the same type
3. **Compile-Time Check**: Uses `Equal` type to enforce exact type equality
4. **Runtime Assertion**: Delegates to Jest's `expect().toBe()` for runtime checking
5. **Return Value**: Returns the expected value for chaining

## Usage

### Basic Usage

```typescript
// Passes - types match exactly and values are equal
expectType("hello").toBe("hello");
expectType(42).toBe(42);
expectType(true).toBe(true);

// Compile error - types don't match exactly
expectType("hello").toBe(42); // Error: Argument of type '42' is not assignable to parameter of type 'never'
expectType(42 as number).toBe(42 as 42); // Error: literal vs base type
```

### Key Features

1. **Exact Type Matching**: Unlike regular `expect()`, this enforces exact type equality
2. **Fluent API**: Integrates naturally with Jest testing patterns
3. **Runtime + Compile-Time**: Catches both type and value mismatches

## Differences from Other Utilities

| Tool | Purpose | Check Type | Syntax |
|------|---------|------------|--------|
| `expectType` | Type-safe runtime testing | Exact equality + runtime value | `expectType(val).toBe(expected)` |
| `assertType` | Pure type checking | Exact type equality | `assertType<T, U>(0)` |
| `expect` (Jest) | Runtime testing | No type checking | `expect(val).toBe(expected)` |

## Design Decisions

### Why Exact Type Equality?

- Catches subtle type differences at compile time
- Prevents comparing literals with base types unintentionally
- Makes tests more precise and intentional

### Why Combine with Jest?

- Familiar API for developers
- Single assertion for both type and value
- Reduces test verbosity

### Why Return the Expected Value?

- Enables chaining if needed
- Consistent with Jest's behavior
- Allows capturing the result

## Examples

### Testing Literal Types

```typescript
const value = "hello" as const;
expectType(value).toBe("hello"); // ✓ Exact match

const num = 42;
expectType(num).toBe(42); // ✓ Both are number type

const literal = 42 as const;
expectType(literal).toBe(42); // ✓ Both are literal 42
expectType(literal).toBe(43); // ✗ Compile error - different literals
```

### Testing Objects

```typescript
const user = { name: "Alice", age: 30 };
expectType(user).toBe({ name: "Alice", age: 30 }); // ✓

// Extra properties cause type mismatch
expectType(user).toBe({ name: "Alice", age: 30, id: 1 }); // ✗ Compile error
```

### Testing with Type Inference

```typescript
function identity<T>(x: T): T {
  return x;
}

const result = identity("test");
expectType(result).toBe("test"); // ✓ Inferred as string
expectType(result).toBe(42); // ✗ Compile error
```

## Best Practices

1. **Use for precise type testing**:
   ```typescript
   const result = processData(input);
   expectType(result).toBe(expectedOutput);
   ```

2. **Prefer over plain expect() when types matter**:
   ```typescript
   // Better - catches type issues
   expectType(getValue()).toBe("expected");
   
   // Weaker - only runtime check
   expect(getValue()).toBe("expected");
   ```

3. **Use with const assertions for literals**:
   ```typescript
   const config = { mode: "production" } as const;
   expectType(config.mode).toBe("production");
   ```

## Limitations

1. **Requires exact type match**: Won't accept subtypes or supertypes
2. **Runtime dependency**: Requires Jest's expect to be available
3. **Value equality**: Uses `toBe` (strict equality), not deep equality