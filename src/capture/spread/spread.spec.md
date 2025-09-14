# Spread Capture Token

Spread capture is a type-level token for sequence (array/tuple) patterns.

## Purpose

- Represents a contiguous slice capture in sequence patterns.
- The generic represents the captured element type, not the slice type.

## Usage

```ts
import type { Spread } from "@/capture";

type P1 = [Spread<"rest", string>];
// Element type is `string` (slice semantics left to consumers)

type P2 = ["head", Spread<"mid", number>, "tail"];
// Element type is `number`; binding may refine via intersection

// Equivalent sequence sugar (conceptual) using the dollar function:
// [ $('head'), ...$('mid'), 'tail' ]  ~>  [ Capture<'head', V>, Spread<'mid', V>, 'tail' ]
```

## Notes

- This token is shape-agnostic; consumers may refine the element type based on
  their reference sequence type (for example, intersecting with the element type
  of the sequence).
- Adjacent spreads are not specified (DC) and should be avoided.
