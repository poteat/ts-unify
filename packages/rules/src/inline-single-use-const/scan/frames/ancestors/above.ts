import type { Node } from '@ts-unify/rules/inline-single-use-const/reads/tree'
import type { ReadEvent } from '@ts-unify/rules/inline-single-use-const/scan/frames'

/**
 * Every node above a read, nearest first, up to the statement of the
 * block asked about.
 *
 * @param read the read
 * @returns each ancestor node, nearest first, then those beyond each frame
 *          chain
 */
export function* above(read: ReadEvent): Generator<Node> {
  for (let at = read.frame.up; at !== null; at = at.up) yield at.node

  for (const beyond of read.beyond) {
    for (let at: typeof beyond | null = beyond; at !== null; at = at.up)
      yield at.node
  }
}
