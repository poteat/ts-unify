# Values Type Utility

## Overview

`Values<T>` extracts all property values from an object type as a union.

## Purpose

This utility type is the type-level equivalent of `Object.values()`. It's useful
when you need to work with all possible values that an object type can contain,
regardless of their keys.

## Behavior

### Basic Objects

For a regular object type, it returns a union of all property value types:

```typescript
type Obj = { a: string; b: number; c: boolean };
type Result = Values<Obj>;
// Result: string | number | boolean
```

### Empty Objects

For empty objects, it returns `never` (since there are no values):

```typescript
type Empty = {};
type Result = Values<Empty>;
// Result: never
```

### Objects with Same Value Types

When all properties have the same type, it returns that single type:

```typescript
type AllStrings = { name: string; description: string; id: string };
type Result = Values<AllStrings>;
// Result: string
```

### Optional Properties

Optional properties contribute `undefined` to the union:

```typescript
type WithOptional = { required: string; optional?: number };
type Result = Values<WithOptional>;
// Result: string | number | undefined
```

### Nested Objects

It extracts the object types themselves, not their nested values:

```typescript
type Nested = {
  user: { name: string; age: number };
  settings: { theme: string };
};
type Result = Values<Nested>;
// Result: { name: string; age: number } | { theme: string }
```

### Index Signatures

Works with index signatures:

```typescript
type StringRecord = { [key: string]: number };
type Result = Values<StringRecord>;
// Result: number

type MixedIndex = {
  [key: string]: string | number;
  specific: boolean;
};
type Result2 = Values<MixedIndex>;
// Result2: string | number | boolean
```

### Arrays and Tuples

**Important**: Since arrays are objects with many properties (methods, length,
etc.), `Values` extracts ALL property values, not just elements:

```typescript
type StringArray = string[];
type Result = Values<StringArray>;
// Result: string | number | ... (includes array methods, length, etc.)

// For extracting just element types from arrays, use indexed access:
type Elements = string[][number]; // string
// string | number | boolean
type TupleElements = [string, number, boolean][number];
```

Tuples behave similarly, returning all properties including array methods:

```typescript
type Tuple = [string, number, boolean];
type Result = Values<Tuple>;
// Result: string | number | boolean ... (includes array properties)
```

For practical array element extraction, consider using conditional types or
indexed access with `number` key.

## Use Cases

1. **Type Guards**: Creating union types for discriminated unions
2. **Validation**: Checking if a value matches any property value type
3. **Transformations**: Mapping over all possible value types
4. **Type Extraction**: Getting all value types from configuration objects

## Comparison with Related Utilities

- `keyof T`: Extracts keys as a union
- `T[K]`: Indexed access for specific key
- `T[keyof T]`: Equivalent to `Values<T>` - extracts all values as a union
- `Pick<T, K>`: Creates new type with subset of properties
- `T[number]`: For arrays/tuples, extracts element types only
