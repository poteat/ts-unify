# Extract Captures Specification

## Overview

`ExtractCaptures<Original, Pattern>` walks two type structures in parallel to
extract capture names and their corresponding types from the original structure.
Supports both explicit captures using `Capture<Name>` and implicit captures
using the `$` function as a sentinel.

## Core Semantics

### Basic Extraction

When a `Capture<Name>` appears in `Pattern` at a position where `Original` has
type `T`:

- Extract the mapping `{ [Name]: T }`

### Implicit Captures with $ Function

When the bare `$` function (not called) appears in `Pattern`:

- **In object properties**: Uses the property key as the capture name
- **In arrays**: Uses the array index as the capture name
- **At root level**: Captures all keys from the original object

**Examples:**

```typescript
// Object properties - uses key names
type Original = { name: string; age: number };
type Pattern = { name: typeof $; age: typeof $ };
type Extracted = ExtractCaptures<Original, Pattern>;
// Result: { name: string; age: number }

// Arrays - uses indices as names
type Original = [string, number];
type Pattern = [typeof $, typeof $];
type Extracted = ExtractCaptures<Original, Pattern>;
// Result: { "0": string; "1": number }

// Root wildcard - captures entire object
type Original = { a: 1; b: 2; c: 3 };
type Pattern = typeof $;
type Extracted = ExtractCaptures<Original, Pattern>;
// Result: { a: 1; b: 2; c: 3 }
```

### Multiple Captures with Same Name

When the same capture name appears multiple times (either explicit or implicit):

- **Type level**: The final type is the intersection of all captured types
- **Runtime semantics**: All positions must contain the same (deep equal) value
- **Validation**: If the intersection results in `never`, the entire extraction
  returns `never`

**Examples:**

```typescript
// Explicit captures
type Original = { a: number; b: number };
type Pattern = { a: Capture<"x">; b: Capture<"x"> };
type Extracted = ExtractCaptures<Original, Pattern>;
// Result: { x: number & number } = { x: number }

// Implicit captures with same key name
type Original = { data: { x: number }; other: { x: number } };
type Pattern = { data: { x: typeof $ }; other: { x: typeof $ } };
type Extracted = ExtractCaptures<Original, Pattern>;
// Result: { x: number } (unified)

// Conflicting types
type Original2 = { a: number; b: string };
type Pattern2 = { a: Capture<"x">; b: Capture<"x"> };
type Extracted2 = ExtractCaptures<Original2, Pattern2>;
// Result: never (pattern unmatchable - x cannot be both number and string)
```

### Structural Recursion

When both `Original` and `Pattern` are objects:

- Recursively extract captures from matching properties
- Merge all extracted captures into single result

**Example:**

```typescript
type Original = {
  user: { id: number; name: string };
  count: number;
};
type Pattern = {
  user: { id: Capture<"userId">; name: Capture<"userName"> };
  count: 42;
};
type Extracted = ExtractCaptures<Original, Pattern>;
// Result: { userId: number; userName: string }
```

### Arrays

Captures within array patterns extract the element type:

```typescript
type Original = number[];
type Pattern = [Capture<"first">, Capture<"second">];
type Extracted = ExtractCaptures<Original, Pattern>;
// Result: { first: number; second: number }
```

### Optional Properties

Captures of optional properties include `undefined`:

```typescript
type Original = { value?: string };
type Pattern = { value: Capture<"v"> };
type Extracted = ExtractCaptures<Original, Pattern>;
// Result: { v: string | undefined }
```

### Union Types

Captures extract the full union type:

```typescript
type Original = { value: string | number };
type Pattern = { value: Capture<"v"> };
type Extracted = ExtractCaptures<Original, Pattern>;
// Result: { v: string | number }
```

## Validation

### Pattern Mismatch

If `Pattern` structure is incompatible with `Original`:

- The extraction returns `never`
- This signals that the pattern cannot match the original type

**Example:**

```typescript
type Original = { a: string };
type Pattern = { a: 42 }; // 42 is not assignable to string
// Should cause type error or return never
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
