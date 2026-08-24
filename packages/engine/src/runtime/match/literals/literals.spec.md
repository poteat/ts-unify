# literals

## Overview

The root literals of a pattern are the values it requires at fixed paths
under the node it matches: the literal fields of its fields record
(`operator: '&&'`, `computed: false`, `alternate: null`), the `type` each
nested node proxy implies, the literal fields of those proxies, the
elements of an array pattern before its first spread, and the values a
`U.or` of literals (or the types a `U.or` of node proxies) allows. A node
that fails one of them fails the match.

`rootLiteralsOf(pattern)` reads them once per pattern object from its root
plan; `agrees(node, literals)` reads the values off a node and tells
whether every literal holds; `valueAt(node, path)` is the read.

## Soundness

A literal is kept only where the match reads the same value the same way:

- a fields record reads `node[key]`; a nested record or node proxy under a
  key reads on from that value, which must be an object for the match to
  go on, so a read past a non-object yields undefined and fails any
  literal but `undefined`, which the match also fails;
- a node proxy checks `node.type` against its tag before its fields;
- an array pattern matches the elements before its first spread at the
  array's head, whatever the spreads, so each of them reads at its index;
- a `U.or` holds when one alternative does, so an or of literals holds
  only for one of those values, and an or of node proxies only for one of
  those types.

Left out, since the match reads them otherwise: a `Comment` proxy and all
under it (a raw comment is matched through its node view, whose fields the
raw comment lacks), a `U.maybeBlock` (the statement may sit one block
down), an or of mixed alternatives, the elements after a spread (their
index depends on the array's length), config slots (their value is the
chain's), string predicates, captures and `$`.

## Examples

```ts
rootLiteralsOf({ operator: U.or('===', '=='), left: U.UnaryExpression({ operator: 'typeof' }) })
// [{ key: 'operator', path: ['operator'], values: ['===', '=='] },
//  { key: 'left.type', path: ['left', 'type'], values: ['UnaryExpression'] },
//  { key: 'left.operator', path: ['left', 'operator'], values: ['typeof'] }]
```

`matchWithSites` reads a pattern's root literals off the node before it
makes a context for the match; `matchAdmitted` is the match without that
read, for a caller that has read them through a dispatcher.
