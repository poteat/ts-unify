# dispatch

## Overview

`dispatcherOf(entries)` builds, once for a list of entries sharing a tag,
a decision tree over the root literals of their patterns (see
`match/literals`), and returns a function of a node: the entries whose
literals the node holds, in the list's order. A caller matches those with
`matchAdmitted`, the first to match winning as it would have had every
entry been tried.

## The tree

Each inner node of the tree names one path. Building it from the rows
(entry, literals not read yet): the path is the one the most rows hold a
literal at; there is a branch for each value any of those literals allows,
holding the rows that allow it or hold no literal at the path; `rest`
holds the rows with no literal at the path, for a value no branch names.
Each row's literal at the path is consumed going down, so the recursion
ends in a leaf of the rows left when no literal is left to read.

Walking the tree, a node has each path on the way read once, and the leaf
holds every entry whose literals all held (every literal was consumed on
a branch allowing the value read) and no entry one of whose literals
failed (such an entry is on no branch for that value, and not in `rest`).
Entries without literals are on every branch and in `rest`.

## Cost

With `P` entries of a tag, each try used to be a match: a context, a
cursor and a bag made, then fields read until the first to disagree. Now
a node reads at most as many values as the deepest row has literals, and
only the entries those values admit are matched, so a node that holds no
entry's literals costs a few property reads and no allocation.

## Examples

```ts
const admitted = dispatcherOf(extractPatterns(rule))

for (const { pattern, chain } of admitted(node)) {
  const result = matchAdmitted(node, pattern, chain)
  if (result) break
}
```
