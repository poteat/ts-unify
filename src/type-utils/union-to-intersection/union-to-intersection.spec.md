# UnionToIntersection

Converts union types to intersection types using contravariance.

## Usage

```typescript
type Union = { a: 1 } | { b: 2 };
type Intersection = UnionToIntersection<Union>;
//   ^? { a: 1 } & { b: 2 }
```

## Purpose

Sometimes you need to combine all members of a union into a single type that
satisfies all constraints. This utility transforms `A | B | C` into `A & B & C`.

## Examples

### Object unions

```typescript
type A = { foo: string };
type B = { bar: number };
type Union = A | B;
type Merged = UnionToIntersection<Union>;
//   ^? { foo: string } & { bar: number }
```

### Function unions

```typescript
type Funcs = ((x: string) => void) | ((x: number) => void);
type Combined = UnionToIntersection<Funcs>;
//   ^? ((x: string) => void) & ((x: number) => void)
// Can be called with both string and number
```

### Single type handling

```typescript
type Single = { a: 1 };
type Result = UnionToIntersection<Single>;
//   ^? { a: 1 }
```

## Implementation

Uses TypeScript's contravariance in function parameters to achieve the
conversion. The union distributes over the conditional type, creating multiple
function types, which are then inferred as an intersection due to
contravariance.
