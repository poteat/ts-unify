import type { Node } from '../../reads/tree'
import { above } from './above'
import type { ReadEvent } from './read-event'

/**
 * Every node above a read with the node it holds on the way down to the
 * read, nearest pair first; the first pair holds the read itself.
 *
 * @param read the read
 */
export function* pairs(read: ReadEvent): Generator<[Node, Node]> {
  let below = read.node

  for (const node of above(read)) {
    yield [node, below]
    below = node
  }
}
