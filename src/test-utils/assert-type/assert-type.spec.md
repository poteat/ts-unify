# AssertType Specification

## Overview

`assertType<T, U>(val)` is a compile-time type assertion helper that ensures two
types are exactly equal using TypeScript's type system.

## Implementation

The function uses conditional types to enforce exact type equality:

```typescript
assertType<T, U>(val: Equal<T, U> extends true ? 0 : never)
```

## How It Works

1. **Type Parameters**: Takes two type parameters `T` (actual) and `U`
   (expected)
2. **Equal Check**: Uses the `Equal` type to verify exact type equality
3. **Conditional Parameter**: The parameter type becomes:
   - `0` if types match exactly
   - `never` if types don't match
4. **Compile-Time Error**: When types don't match, passing `0` to a `never`
   parameter causes a TypeScript error

## Usage

### Basic Usage

```typescript
// Passes - types match exactly
assertType<string, string>(0);
assertType<{ a: number }, { a: number }>(0);

// Fails - compile error
assertType<string, number>(0); // Error: Argument of type '0' is not assignable to parameter of type 'never'
assertType<"hello", string>(0); // Error: literal vs base type
```

### In Tests

```typescript
test("type assertions", () => {
  type Result = SomeComplexType<Input>;
  assertType<Result, ExpectedType>(0);

  // Runtime assertion
  expect(true).toBe(true);
});
```

## Design Decisions

### Why `0` as the argument?

- **Minimal**: Single character, least visual noise
- **Literal**: TypeScript can optimize literal types well
- **Convention**: Commonly used in type-level testing

### Why not void or undefined?

- `void`/`undefined` could be confused with actual values
- `0` is clearly just a placeholder for the type check

### Why not a type-only assertion?

TypeScript doesn't allow type-only declarations in test files that get executed.
The function provides a runtime no-op that enables compile-time checking.

## Comparison with Alternatives

### `expectType` from expect-type library

- More features but larger dependency
- `assertType` is minimal and sufficient for most cases

### Manual `const _: Type = value`

- Requires creating actual values
- `assertType` works purely at type level

### `// @ts-expect-error` comments

- Only tests for errors, not exact matches
- Less precise than `assertType`

## Limitations

1. **No partial matches**: Cannot check if types are "compatible", only exact
2. **No runtime behavior**: Pure compile-time check
3. **Requires Equal type**: Depends on the Equal utility

## Best Practices

1. Use in test files to verify type transformations
2. Place assertions near the type definitions they test
3. Combine with runtime tests for full coverage
4. Use descriptive type names for clarity:
   ```typescript
   type ActualResult = Transform<Input>;
   type ExpectedResult = { foo: string };
   assertType<ActualResult, ExpectedResult>(0);
   ```
