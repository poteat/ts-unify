# Prettify

Flattens intersection types into a single object type for cleaner IDE display.

## Usage

```typescript
type Intersected = { a: 1 } & { b: 2 };
type Clean = Prettify<Intersected>;
//   ^? { a: 1; b: 2 }
```

## Purpose

When TypeScript displays intersection types, they often appear as `A & B & C`
which can be hard to read. Prettify flattens these into a single object type for
better readability in IDE tooltips and error messages.

## Examples

### Basic intersection flattening

```typescript
type A = { foo: string };
type B = { bar: number };
type Combined = Prettify<A & B>;
//   ^? { foo: string; bar: number }
```

### Nested intersections

```typescript
type Deep = { a: { b: 1 } } & { c: { d: 2 } };
type Flat = Prettify<Deep>;
//   ^? { a: { b: 1 }; c: { d: 2 } }
```

## Notes

- Purely for display purposes; doesn't change type behavior
- Useful for improving type hints in IDE
- No runtime impact (type-only utility)
