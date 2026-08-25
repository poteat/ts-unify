import type { Node } from '@ts-unify/rules/inline-single-use-const/reads/tree'

import Ancestors from './ancestors'
import type { ReadEvent } from './types'

/**
 * Every node above a read with the node it holds on the way down to the
 * read, nearest pair first; the first pair holds the read itself.
 *
 * @param read the read
 */
export function* pairs(read: ReadEvent): Generator<[Node, Node]> {
  let below = read.node

  for (const node of Ancestors.above(read)) {
    yield [node, below]
    below = node
  }
}
