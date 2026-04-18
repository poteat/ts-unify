# applyRewrites

## Overview

`applyRewrites(matchedNode, sites, capturePaths)` is the runtime that turns
inner-`.to()` declarations into actual AST output. `.to()` may be attached to
any sub-pattern, not just a rule's root: when a matched pattern contains one or
more `.to()` calls, the engine clones the matched node and applies the rewrites
bottom-up, splicing each factory's reified output back into the clone at the
position the inner pattern matched.

This module is the runtime side. The type-level surface — what `.to()` returns
and where it can appear — lives in `node-with-to.spec.md`.

This generalizes both the existing root-level `.to()` and `U.seq().to()`. Seq
becomes a special case: a `.to()` attached to a span position in an array
pattern.

## Scope

- Runtime: the match engine (`matchWithSites`) records every proxy whose chain
  contains a `.to()` along with the path at which that proxy matched. After
  matching, `applyRewrites` applies the recorded rewrites bottom-up and rebinds
  capture-bag entries to the rewritten subtrees so outer factories see
  post-rewrite values.

## Design

### Sites and paths

A `RewriteSite` is `{ path, factory, scopeBag, span? }`:

- `path`: a sequence of `(string | number)` keys leading from the root of the
  matched node to the position the inner pattern occupied. `string` keys are
  object property names; `number` keys are array indices.
- `factory`: the function passed to `.to(...)`.
- `scopeBag`: the merged capture bag that the inner pattern produced. This is
  the bag the factory receives.
- `span` (optional): for seq-style rewrites that consume more than one array
  element, the number of consecutive elements to replace.

Sites are collected during match. Each match function knows its own path prefix
(passed in by the caller) and pushes sites with full paths.

### Bottom-up application

After a successful match:

1. Clone the matched node (drop `parent`, `loc`, `range`, `tokens`, etc.).
2. Sort sites by path depth descending. For ties, order is irrelevant (sibling
   sites are spatially disjoint by construction).
3. For each site, in order: a. Run `factory(scopeBag)` to get a result. b. Reify
   the result. c. Splice the reified value into the clone at `path` (replacing
   one entry, or `span` consecutive entries for seq). d. **Rebind**: for every
   named capture in the bag whose source path is at-or-under this site's path,
   rebind it in the bag to the reified result. This makes inner rewrites visible
   to outer factories.
4. If the rule has no top-level `.to()`, the clone is the rewrite output. If the
   rule has a top-level `.to()`, run its factory on the post-rewrite bag and use
   that as the output instead.

### Capture rebinding

During match, alongside the value, every named capture's path is recorded in a
`capturePaths: Record<string, Path>`. When a site at path `P` is applied, we
walk `capturePaths`: any entry whose path is `P` or extends `P` is rebound in
the bag. The new value is the reified result of the rewrite.

For seq sites covering multiple positions: captures at paths inside the spanned
indices are NOT rebound (they only meaningfully exist in the seq's local scope;
the seq's factory has already consumed them).

### Guards

`.when()` guards run at their own scope, in pre-rewrite form. Concretely: guards
on a sub-pattern's chain run before any rewrites are applied anywhere — guards
are part of match-time validation, not part of the rewrite pipeline. This keeps
guard logic local to the source AST and avoids action-at-a-distance from inner
rewrites.

If a user wants a check on a post-rewrite value, they place the guard on the
inner `.to()` chain that produced it (the inner guard runs before that inner's
`.to()`, the outer guard runs before any rewrites in the outer scope, and outer
factories see the rewritten captures).

### Seq as sugar

`U.seq(P1, P2, ...).to(f)` is equivalent to a site at the array span position
covering `args.length` consecutive elements, with `f` as the factory. The seq
machinery is implemented in terms of the general site mechanism.

## Semantics — worked example

Pattern:

```ts
U.CallExpression({
  callee: $("f"),
  arguments: [
    $("x").to(({ x }) =>
      U.BinaryExpression({
        operator: "+",
        left: x,
        right: U.Literal({ value: 1 }),
      }),
    ),
  ],
}).to(({ f, x }) =>
  U.CallExpression({ callee: U.Identifier({ name: "g" }), arguments: [x] }),
);
```

Source: `f(5)`.

After match:

- `bag = { f: Identifier("f"), x: Literal(5) }`
- `capturePaths = { f: ["callee"], x: ["arguments", 0] }`
- `sites = [   { path: ["arguments", 0], factory: increment, scopeBag: { x: Literal(5) } },   { path: [], factory: rename, scopeBag: bag }, ]`

Bottom-up:

1. Inner site `["arguments", 0]` runs:
   - `factory({ x: Literal(5) })` → `BinaryExpression(5 + 1)`.
   - Splice into clone at `arguments[0]`.
   - Rebind: `bag.x` was at path `["arguments", 0]` → now
     `BinaryExpression(5 + 1)`.
2. Outer site `[]` runs:
   - `factory({ f, x: BinaryExpression(5 + 1) })` → `CallExpression(g, [5+1])`.
   - This replaces the entire output.

Final output: `g(5 + 1)`.

## Examples

### Wrap-preserving rule (no outer `.to()`)

```ts
// Match a function-body block whose only statement is an expression
// statement, and rewrite that statement to a return.
export const addReturnToBlock = U.BlockStatement({
  parent: functionParent,
  body: [
    U.ExpressionStatement({ expression: $("expression") }).to(
      ({ expression }) => U.ReturnStatement({ argument: expression }),
    ),
  ],
});
```

The outer `BlockStatement` is preserved structurally because the rule has no
top-level `.to()`. The inner rewrite turns the expression statement into a
return statement, in place.

### Sibling inner `.to()`s

```ts
U.IfStatement({
  test: $("cond"),
  consequent: U.BlockStatement(...).to(({ only }) => only),    // strip braces
  alternate: U.BlockStatement(...).to(({ only }) => only),     // strip braces
})
```

Both inner sites are applied; they're spatially disjoint, so the order between
them doesn't matter.

### Inner `.to()` feeding into outer `.to()`

```ts
U.CallExpression({
  callee: $("f"),
  arguments: [
    $("x").to(({ x }) => U.BinaryExpression({ operator: "+", left: x, right: U.Literal({ value: 1 }) })),
  ],
}).to(({ x }) => /* x is the rewritten BinaryExpression here */ ...)
```

## Compatibility

- Rules without inner `.to()` see no behavior change.
- Existing `U.seq().to()` rules continue to work; they are now implemented
  through the general site mechanism.
- Inner `.to()` was a silent no-op before this change; rules that relied on this
  no-op (none currently exist) would now see the rewrite take effect.
