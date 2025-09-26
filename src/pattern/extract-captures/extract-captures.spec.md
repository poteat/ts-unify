# Extract Captures Specification

## Overview

`ExtractCaptures<Pattern>` walks a pattern structure and produces a mapping of
capture names to their value types.

- Explicit captures contribute their declared value type.
- Implicit placeholders (`$` in type positions) contribute `unknown`.

## Core Semantics

### Basic Extraction

When a `Capture<Name>` appears in `Pattern`:

- Extract the mapping `{ [Name]: unknown }`

### Implicit Captures via Placeholder

When the bare placeholder token (not called) appears in `Pattern`:

- In object properties: use the property key as the capture name
- In arrays/tuples: use the array index as the capture name

**Examples:**

```typescript
// Object properties - uses key names
type Pattern = { name: $; age: $ };
type Extracted = ExtractCaptures<Pattern>;
// Result: { name: unknown; age: unknown }

// Arrays - uses indices as names
type Pattern = [$, $];
type Extracted = ExtractCaptures<Pattern>;
// Result: { "0": unknown; "1": unknown }
```

### Multiple Captures with Same Name

When the same capture name appears multiple times (either explicit or implicit),
all occurrences coalesce to a single entry in the extracted mapping. Value types
combine via intersection: e.g. `number` and `string` become `number & string`
(which is `never`).

**Examples:**

```typescript
// Explicit captures
type Pattern = { a: Capture<"x">; b: Capture<"x"> };
type Extracted = ExtractCaptures<Pattern>;
// Result: { x: unknown }

// Implicit captures with same key name
type Pattern = { data: { x: $ }; other: { x: $ } };
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

### Spread Captures (sequences)

When a `Spread<Name, Elem>` appears in a sequence pattern (array/tuple), the
extracted mapping includes `Name` with value type `ReadonlyArray<Elem>`.

```typescript
import type { Spread } from "@/capture";

type Pattern = [string, Spread<"rest", number>, string];
type Extracted = ExtractCaptures<Pattern>;
// Result: { rest: ReadonlyArray<number> }
```

### Explicit Capture Value Types

Explicit captures propagate their value types:

```typescript
type Pattern = { value: Capture<"v", number> };
type Extracted = ExtractCaptures<Pattern>;
// Result: { v: number }
```

## Notes

- This module defines type-level extraction only. Any runtime matching or value
  unification is outside its scope.

### Sealed Subtrees (Re‑keying Single Capture)

When a builder‑returned node is marked as sealed and used as the value of an
object property in a larger pattern, `ExtractCaptures` applies a re‑key rule:

- If the sealed subtree’s capture bag has exactly one key, that key is renamed
  to the embedding property’s name.
- If it has zero or multiple keys, no re‑keying occurs.

This enables helpers that capture a single value (often narrowed via `.when`) to
contribute that value under the parent’s property name.

```ts
// Example using the `Sealed<…>` brand to mark a sealed subtree:
type Pattern = {
  test: $("t");
  consequent: Sealed<{ body: [ReturnStatement<{ argument: $ }>] }>;
  alternate: $("a");
};

type Bag = ExtractCaptures<Pattern>;
// Bag includes: { consequent: unknown } — inner single capture re‑keys
```
