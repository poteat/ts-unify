# $ (Dollar) Function

Factory function for creating capture sentinels with literal-typed names. Also
serves as an implicit sentinel when referenced as the bare `$` value at the type
level (e.g., `typeof $`).

## Usage

```typescript
const capture = $("captureName");
```

## Purpose

The `$` function provides a concise way to create capture sentinels in patterns.
It preserves the literal type of the name string for compile-time type
extraction.

## Examples

### Basic usage

```typescript
const userId = $("userId");
const userName = $("userName");
```

### In patterns

```typescript
const pattern = {
  user: {
    id: $("userId"),
    name: $("userName"),
    age: $("userAge"),
  },
};
```

### Array patterns

```typescript
const arrayPattern = [$("first"), $("second"), $("third")];
```

### Spread form (sequence sugar)

In sequence contexts (arrays/tuples), the spread form `...$('name')` denotes a
spread-capture at that position. At the type level, this is equivalent to
including a `Spread<'name', Value>` token in the sequence pattern.

```ts
// Conceptual, type-level semantics:
// [ $('head'), ...$('rest') ]  ~>  [ Capture<'head', V>, Spread<'rest', V> ]

// Typed spreads use the same generic parameter `Value` for element type:
// [ ...$<'rest', string>('rest') ]  ~>  [ Spread<'rest', string> ]
```

Notes:
- Spread form is only valid in sequences and always uses the called form
  `$('name')` (the bare `$` placeholder is not iterable at runtime).
- Adjacent spreads are DC (unspecified) and may be constrained by consumers.
- This module documents the semantics; runtime support for `...$('name')`
  requires `$` to return a value that is iterable and yields a single
  spread token (to be implemented by consumers).

## Type Signature

```ts
type $ = <const Name extends string, Value = unknown>(
  name: Name
) => Capture<Name, Value>;
```

- `Name` is preserved as a string literal type via the `const` type parameter.
- `Value` is optional and defaults to `unknown`. You can provide it explicitly
  using `$<"name", Value>("name")`.

Type-level shorthand: this module also exports a type alias named `$` that is
equivalent to `typeof $`. In type positions you may use `$` instead of writing
`typeof $`.

## Implementation Notes

- Uses `const` type parameter for literal type preservation
- Returns a branded object with Symbol property
- Objects are frozen to prevent runtime mutations
- Minimal runtime overhead (just object creation + freeze)
- Passing an empty string at runtime throws an error

## Implicit Sentinel (typeof $)

- In object patterns, `typeof $` at property `K` implies capture name `K`.
- In tuple/array patterns, `typeof $` at position `i` implies name `${i}`.
- At the root, bare `$` has no key context; consumers may reject or ignore it.
