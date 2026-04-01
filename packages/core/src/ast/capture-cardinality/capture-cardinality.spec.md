# CaptureCardinality

## Overview

Type-level utilities that classify a node's capture count as zero, one, or many.
They are used by fluent method gates (e.g., `.truthy`, `.seal`) to restrict
availability based on how many captures a pattern contains.

## Exports

### `HasZeroCaptures<N>`

Returns `true` when `ExtractCaptures<N>` produces an empty bag (no keys).

```typescript
type R = HasZeroCaptures<{ type: "Identifier"; name: "foo" }>;
// R = true
```

### `HasSingleCapture<N>`

Returns `true` when `ExtractCaptures<N>` produces a bag with exactly one key.

```typescript
type R = HasSingleCapture<{ type: "ReturnStatement"; argument: Capture<"arg"> }>;
// R = true
```

### `HasManyCaptures<N>`

Returns `true` when the bag has two or more keys (neither zero nor one).

```typescript
type R = HasManyCaptures<{
  a: Capture<"x">;
  b: Capture<"y">;
}>;
// R = true
```

## Implementation Note

All three helpers derive a deterministic key tuple from `ExtractCaptures<N>` via
`KeysToTuple` and check tuple length to classify cardinality.
