# NodeWithMap

## Overview

`NodeWithMap<N>` adds a fluent `.map` method that transforms the capture bag
of a node type `N` and structurally applies the new bag back to the node's
embedded capture/spread occurrences.

## Scope

- Provider type used by builder‑returned nodes. Defines the `.map` typing and
  structural application only; no runtime behavior is prescribed.
- Works with single‑capture ergonomics and arbitrary capture bags.

## Design

- Single‑capture overload:
  - Enabled when the node has exactly one capture key.
  - Signature: `(value) => NewValue` returns the node with that capture’s value
    replaced by `NewValue`, and all occurrences updated.
- Bag overload:
  - Always available.
  - Signature: `(bag) => NewBag` returns the node with occurrences updated per
    `NewBag`.
- Occurrence update rules:
  - `Capture<'name', _>` becomes `Capture<'name', NewBag['name']>` when present.
  - `Spread<'name', Elem>` becomes `Spread<'name', ElemN>` when
    `NewBag['name']` is `ReadonlyArray<ElemN>`.
  - Recurses through tuples, arrays, and objects.

## Category Rehydration

- When a mapped value is provided as a builder result (fluent node), `.map`
  unwraps it to its inner node shape and widens it to the full ESTree node
  interface for its `type` tag (adds `parent`, `loc`, `range`).
- When the resulting value is an `Expression` or `Statement` subtype union,
  `.map` collapses it to the corresponding category union
  (`TSESTree.Expression`/`TSESTree.Statement`) to keep types tractable.

## Examples

```ts
// Single capture
type N = { type: 'ReturnStatement'; argument: Capture<'arg', string | null> };
const mapped = U.ReturnStatement({ argument: $('arg') })
  .map(x => x ?? U.Identifier({ name: 'undefined' }));
// argument’s capture value becomes `TSESTree.Expression`

// Bag map over multiple captures
const node = U.IfStatement({ test: $('t'), consequent: $('c'), alternate: $('a') })
  .map(bag => ({ ...bag, c: U.Identifier({ name: 'x' }) }));
// c’s capture value widens to full ESTree Identifier and collapses to Expression
```

## Notes

- `.map` composes with `.when`, `.or`, and `.seal`.
- This is a type‑only utility; downstream consumers define runtime semantics.

