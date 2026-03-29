# ExtractConfig Specification

## Overview

`ExtractConfig<Pattern>` walks a pattern structure and produces a mapping of
config slot names to their value types.

- Config slots with explicit value types contribute their declared type.
- Config slots without value types contribute `unknown`.

## Core Semantics

### Basic Extraction

When a `ConfigSlot<Name, Value>` appears in `Pattern`:

- Extract the mapping `{ [Name]: Value }`

**Examples:**

```typescript
type Pattern = { theme: ConfigSlot<"theme"> };
type Config = ExtractConfig<Pattern>;
// Result: { theme: unknown }

type PatternTyped = { retries: ConfigSlot<"retries", number> };
type ConfigTyped = ExtractConfig<PatternTyped>;
// Result: { retries: number }
```

### Multiple Config Slots

When multiple config slots appear in a pattern:

```typescript
type Pattern = {
  theme: ConfigSlot<"theme", string>;
  retries: ConfigSlot<"retries", number>;
};
type Config = ExtractConfig<Pattern>;
// Result: { theme: string; retries: number }
```

### Structural Recursion

When `Pattern` is a nested object:

- Recursively extract config slots from all properties
- Merge all extracted configs into a single result

**Example:**

```typescript
type Pattern = {
  settings: {
    theme: ConfigSlot<"theme", string>;
    display: {
      fontSize: ConfigSlot<"fontSize", number>;
    };
  };
  name: "App";
};
type Config = ExtractConfig<Pattern>;
// Result: { theme: string; fontSize: number }
```

### Arrays

Config slots within array patterns:

```typescript
type Pattern = [ConfigSlot<"first">, ConfigSlot<"second">];
type Config = ExtractConfig<Pattern>;
// Result: { first: unknown; second: unknown }
```

### Coexistence with Captures

Config slots and captures can coexist in the same pattern. `ExtractConfig`
only extracts config slots and ignores captures.

```typescript
type Pattern = {
  id: Capture<"id">;
  theme: ConfigSlot<"theme", string>;
};
type Config = ExtractConfig<Pattern>;
// Result: { theme: string }
```

## Notes

- This module defines type-level extraction only. Any runtime resolution of
  config values is outside its scope.
- `ExtractConfig` skips `TSESTree.Node` subtrees, sealed wrappers, and OR
  branches, mirroring the traversal strategy of `ExtractCaptures`.
