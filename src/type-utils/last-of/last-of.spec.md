# LastOf

Extracts the last member of a union type using variance tricks.

## Usage

```typescript
// 3 (specific order depends on TypeScript internals)
type Last = LastOf<1 | 2 | 3>;
```

## Purpose

This utility is primarily used as a helper for converting unions to tuples. It
allows iterative extraction of union members by always getting one member that
can be excluded to process the rest.

## Examples

### Numeric unions

```typescript
type Numbers = 1 | 2 | 3;
type Last = LastOf<Numbers>; // One of the numbers (order not guaranteed)
```

### String unions

```typescript
type Strings = "a" | "b" | "c";
type Last = LastOf<Strings>; // One of the strings
```

## Implementation Details

Uses `UnionToIntersection` to convert a union of functions into an intersection,
then extracts the return type. The specific "last" element depends on
TypeScript's internal ordering and should not be relied upon for specific
values.

## Notes

- Order is not guaranteed or stable across TypeScript versions
- Primarily used internally for union-to-tuple conversion
- Not recommended for direct use in application code
