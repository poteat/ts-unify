# UnionToTuple

Converts a union to a tuple, enabling iteration over union members.

## Usage

```typescript
type Tuple = UnionToTuple<"a" | "b" | "c">;
//   ^? ["a", "b", "c"] (order may vary)
```

## Purpose

TypeScript doesn't provide a built-in way to iterate over union members. This
utility converts unions to tuples, allowing you to process each member
sequentially in recursive type operations.

## Examples

### String unions

```typescript
type Options = "red" | "green" | "blue";
type OptionsTuple = UnionToTuple<Options>;
//   ^? ["red", "green", "blue"] (order may vary)
```

### Number unions

```typescript
type Numbers = 1 | 2 | 3;
type NumbersTuple = UnionToTuple<Numbers>;
//   ^? [1, 2, 3] (order may vary)
```

### Empty union

```typescript
type Empty = never;
type EmptyTuple = UnionToTuple<Empty>;
//   ^? []
```

## Implementation

Uses tail-call optimization (TCO) pattern to avoid recursion depth limits.
Iteratively extracts union members using `LastOf` and accumulates them into a
tuple.

## Notes

- Order of elements is not guaranteed
- Uses TCO pattern to handle large unions
- Commonly used with `KeysToTuple` for object processing
