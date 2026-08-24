# scan

## Overview

One pass over a block for `inlinableConst`: every identifier under the
block is read once, and the pass answers, for each const of the block,
what the statements after it do with its name.

## Design

- `analyze` walks the statements last to first. At each statement the
  tallies hold the statements after it, so a const is judged before its
  own statement is read: its name is read once, in the next statement,
  never bound again, never named in a type, and `moves` says the
  initializer can stand where the read is.
- A `Tally` counts one name: bound again, named in a type, the number of
  reads, and the read itself while there is exactly one. A read keeps its
  frames (`Frame`: a node and the frame above it, up to the statement) so
  `moves` can look at what stands between the statement and the read.
- A nested block is read through its own `Analysis`, built once and kept
  by the block's statement list (`analyses`), and merged into the tallies
  of the block above; a read merged from below continues its frames at
  the nested block's frame (`ReadEvent.beyond`).
- `readsOf` did not look under an identifier spelling the name searched;
  `Suppressed` keeps that: under an identifier, reads of its own name do
  not count, merges from nested blocks included.
- The earliest end of an effect under each statement is kept as the
  statement is read (`minEffectEnd`), for the check that the initializer's
  effects would not move past another effect.

## Complexity

The previous shape walked the rest of the block three times per const
(binding, type position, reads), with a fresh ancestor list per node:
O(consts × size) per block, and a nested block walked again for every
block above it. This shape walks each node once per file: O(size), with
one merge per name per nested block.
