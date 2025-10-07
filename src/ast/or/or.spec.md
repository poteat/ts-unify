# Or Combinator

## Overview

`U.or(...branches)` composes a disjunction of patterns. At runtime it matches
each branch left‑to‑right and returns the first successful match. At the type
level it produces a single fluent node whose shape is the union of the branch
shapes, and whose capture bag reflects a union of the branches’ capture bags.

## Scope

- Provider type used by builder‑returned nodes. Describes typing and
  match/ordering semantics only; no runtime is prescribed here.
- Variadic: accepts one or more branches.
- Branches are standard fluent nodes (builder results), and may be of the same
  or different kinds.

## Design

- Inputs/Outputs:
  - Literals-only: `U.or(v1, v2, ..., vn)` where every `vi` is a primitive
    literal (string, number, boolean, bigint, symbol, null, undefined) → returns
    the plain union `v1 | v2 | ... | vn`.
  - Fluent: When all branches are `FluentNode<Ni>` → returns
    `FluentNode<N1 | N2 | ... | Nk | V1 | ... | Vm>`.
- Capture bag for `.when`/`.to` derives from the union:
  `ExtractCaptures<N1 | ... | Nk | V1 | ... | Vm>`.

## Semantics

- Disjunction: a value matches the composed pattern if it matches any branch.
- Ordering: branches are tested left‑to‑right; the first match wins.
- Narrowing:
  - `.when(...)` after `or(...)` narrows the unioned capture bag. Guards may
    refine the entire bag or branch‑specific subsets.
  - Single‑capture value‑guard ergonomics apply when every branch contributes
    exactly one capture. Branch keys may differ across branches; the guard
    receives the union of those single‑capture value types.
  - If any branch has zero captures or a branch has multiple captures, use the
    bag form `.when((bag) => …)`.
- `.to(...)`:
  - Factory form: receives `ExtractCaptures<N1 | ... | Nn>` (union of branch
    bags). Use type guards to refine per‑branch inside the factory when needed.
  - Builder form: `.to(builder)` succeeds when the unioned bag is compatible
    with the builder’s accepted shape (commonly when branches share the required
    keys).
- Capture names:
  - Within a branch, duplicate names coalesce by intersection (see
    `ExtractCaptures`).
  - Across branches, the bag becomes a union of branch bags; a name present in
    multiple branches has a union of its value types.
- Spreads and sealing:
  - Spread element types follow the same unioning rules.
  - Sealed subtrees in branches remain sealed; re‑keying semantics apply at the
    parent boundary of each branch as usual.

## Examples

### Single‑Capture (Different Names) — use value guard

```ts
// Different names across branches → bag union
const a = U.ReturnStatement({ argument: $("arg") });
const b = U.AwaitExpression({ argument: $("value") });
const anyOne = U.or(a, b).when((val): val is string => typeof val === "string");
```

### Mixed (Zero vs One Capture) — use bag guard

```ts
const retExpr = U.ReturnStatement({ argument: $("arg") });
const retNoArg = U.ReturnStatement({}); // zero‑capture branch
const ret = U.or(retExpr, retNoArg).when(
  (bag): bag is { arg: string } =>
    "arg" in bag && typeof (bag as any).arg === "string"
);
```
