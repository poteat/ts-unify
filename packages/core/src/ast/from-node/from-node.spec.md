# fromNode

Create a fluent node from an object that includes a `type` discriminant. This
mirrors the builder behavior (`U.Kind(...)`) but anchors the kind via the
input’s `type` rather than the function name.

## Usage

- Any kind: `U.fromNode({ type: 'ReturnStatement' })` →
  `FluentNode<{ type: 'ReturnStatement' }>`
- Build shape:
  `U.fromNode({ type: 'ReturnStatement', argument: U.Identifier({ name: 'x' }) })`
  → `FluentNode<ReturnStatement>`
- Match pattern: `U.fromNode({ type: 'ReturnStatement', argument: $ })` →
  `FluentNode<{ type: 'ReturnStatement'; argument: Capture<'argument', Expr> }>`

The shape and pattern forms are 1:1 with the overloads of `PatternBuilder<K>`:

- Concrete shapes (no captures) return a `FluentNode<NodeByKind[K]>`.
- Patterns (supporting `$`, `Capture`, spreads) return a
  `FluentNode<{ type } & BindCaptures<...>>`.

## Rationale

- Enable builder‑equivalent ergonomics when you already have an object with a
  `type` tag or when the kind is computed dynamically.
- Keep downstream typing identical to the builder entrypoints; no new semantics
  are introduced.

## Notes

- Input keys other than `type` are validated against the selected kind’s shape.
  Internal ESTree fields (`parent`, `loc`, `range`) are excluded from shape
  typing.
- Passing only `{ type }` is equivalent to the nullary builder call `U.Kind()`.
