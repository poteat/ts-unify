# KeysToTuple

Converts object keys to a tuple for sequential processing.

## Usage

```typescript
type Keys = KeysToTuple<{ foo: 1; bar: 2 }>;
//   ^? ["foo", "bar"] (order may vary)
```

## Purpose

When processing objects recursively in the type system, you often need to
iterate over keys sequentially. This utility converts the union of keys into a
tuple that can be processed one by one.

## Examples

### Basic object

```typescript
type Obj = { name: string; age: number; active: boolean };
type Keys = KeysToTuple<Obj>;
//   ^? ["name", "age", "active"] (order may vary)
```

### Empty object

```typescript
type Empty = {};
type Keys = KeysToTuple<Empty>;
//   ^? []
```

### Non-object types

```typescript
type Primitive = string;
type Keys = KeysToTuple<Primitive>;
//   ^? []
```

## Implementation

Combines `keyof T` with `UnionToTuple` to convert the union of keys into a
processable tuple. Returns empty tuple for non-object types.

## Use Cases

- Recursive object processing in type-level programming
- Sequential key validation
- Type-safe object transformation utilities
