import Literals from '@ts-unify/engine/runtime/match/literals'

import Tree from './tree'
import type { Dispatcher } from './types'
/**
 * A dispatcher over entries sharing a tag, built once for the list as a
 * decision tree over the root literals of their patterns.
 *
 * A node walks the tree reading each path once and reaches the entries
 * it could match, in the list's order.
 *
 * @param entries the entries, each holding its pattern
 */
export function dispatcherOf<E extends { pattern: unknown }>(
  entries: readonly E[],
): Dispatcher<E> {
  const tree = Tree.buildTree(
    entries.map(entry => ({
      entry,
      literals: Literals.rootLiteralsOf(entry.pattern),
    })),
  )

  return node => Tree.candidatesOf(tree, node)
}
