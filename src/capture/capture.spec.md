# Capture Specification

## Overview

A capture is a sentinel value that marks a position in a data structure for
later extraction and type inference.

## Type Definition

### `Capture<Name>`

```typescript
type Capture<Name extends string = string> = {
  readonly [CAPTURE_BRAND]: true;
  readonly name: Name;
};
```

**Properties:**

- `[CAPTURE_BRAND]`: A symbol-keyed property with value `true` that uniquely
  identifies captures
- `name`: The literal string name of the capture, preserved at type level

**Type Parameter:**

- `Name extends string = string`: Defaults to `string` but preserves literal
  types when provided

## Construction

### `$` Function

```typescript
const $ = <const Name extends string>(name: Name): Capture<Name>
```

**Behavior:**

- Takes a string literal and returns a `Capture` with that exact literal type
- The `const` modifier ensures literal types are preserved
- Creates an object with the symbol brand and the provided name

**Examples:**

```typescript
$("foo"); // Type: Capture<"foo">
$("bar"); // Type: Capture<"bar">
```

## Runtime Detection

### `isCapture` Function

```typescript
const isCapture = (value: unknown): value is Capture
```

**Behavior:**

- Type guard that checks if a value is a capture at runtime
- Returns `true` if and only if:
  - `value` has the `CAPTURE_BRAND` symbol property
  - That property's value is exactly `true`
- Safely handles all JavaScript values (null, undefined, primitives, objects)

**Examples:**

```typescript
isCapture($("test")); // true
isCapture({ name: "test" }); // false
isCapture(null); // false
isCapture(undefined); // false
isCapture(42); // false
```

## Type Safety

### Literal Type Preservation

Captures preserve their exact literal name type:

```typescript
const c = $("myName");
type NameType = typeof c.name; // "myName" (not string)
```

### Brand Protection

The symbol brand prevents structural type matching from accidentally treating
other objects as captures:

```typescript
const notCapture = { name: "foo" };
const realCapture = $("foo");

isCapture(notCapture); // false - missing brand
isCapture(realCapture); // true - has brand
```

## Invariants

1. **Immutability**: All capture properties are `readonly`
2. **Brand uniqueness**: Only objects created via `$()` have the `CAPTURE_BRAND`
3. **Type preservation**: The literal string type of the name is preserved at
   compile time
4. **Runtime verifiability**: Any value can be checked with `isCapture()` at
   runtime
