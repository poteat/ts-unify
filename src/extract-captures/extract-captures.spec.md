# Extract Captures Specification

## Overview

`ExtractCaptures<Pattern>` walks a pattern structure to extract all capture
names with `unknown` type. Supports both explicit captures using `Capture<Name>`
and implicit captures using the `$` function as a sentinel.

## Core Semantics

### Basic Extraction

When a `Capture<Name>` appears in `Pattern`:

- Extract the mapping `{ [Name]: unknown }`

### Implicit Captures with $ Function

When the bare `$` function (not called) appears in `Pattern`:

- **In object properties**: Uses the property key as the capture name
- **In arrays**: Uses the array index as the capture name

**Examples:**

```typescript
// Object properties - uses key names
type Pattern = { name: typeof $; age: typeof $ };
type Extracted = ExtractCaptures<Pattern>;
// Result: { name: unknown; age: unknown }

// Arrays - uses indices as names
type Pattern = [typeof $, typeof $];
type Extracted = ExtractCaptures<Pattern>;
// Result: { "0": unknown; "1": unknown }
```

### Multiple Captures with Same Name

When the same capture name appears multiple times (either explicit or implicit):

- All occurrences map to `{ [Name]: unknown }`
- **Runtime semantics**: All positions must contain the same (deep equal) value

**Examples:**

```typescript
// Explicit captures
type Pattern = { a: Capture<"x">; b: Capture<"x"> };
type Extracted = ExtractCaptures<Pattern>;
// Result: { x: unknown }

// Implicit captures with same key name
type Pattern = { data: { x: typeof $ }; other: { x: typeof $ } };
type Extracted = ExtractCaptures<Pattern>;
// Result: { x: unknown }
```

### Structural Recursion

When `Pattern` is an object:

- Recursively extract captures from all properties
- Merge all extracted captures into single result

**Example:**

```typescript
type Pattern = {
  user: { id: Capture<"userId">; name: Capture<"userName"> };
  count: 42;
};
type Extracted = ExtractCaptures<Pattern>;
// Result: { userId: unknown; userName: unknown }
```

### Arrays

Captures within array patterns:

```typescript
type Pattern = [Capture<"first">, Capture<"second">];
type Extracted = ExtractCaptures<Pattern>;
// Result: { first: unknown; second: unknown }
```

### All Captures Extract as Unknown

Regardless of position, all captures extract as `unknown`:

```typescript
type Pattern = { value: Capture<"v"> };
type Extracted = ExtractCaptures<Pattern>;
// Result: { v: unknown }
```

## Unification Constraint

The key semantic: **captures with the same name represent a unification
constraint**.

At runtime, all positions with `Capture<"foo">` must contain the same value
(deep equality). This allows expressing patterns like "these two values must be
equal" without knowing the value in advance.

**Use Case Example:**

```typescript
// Pattern expressing "user.id must equal selectedId"
const pattern = {
  user: { id: $("id") },
  selectedId: $("id"),
};

// Matches: { user: { id: 5 }, selectedId: 5 }
// Doesn't match: { user: { id: 5 }, selectedId: 10 }
```
