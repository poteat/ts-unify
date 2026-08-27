import Literals from '@ts-unify/engine/runtime/match/literals'

import type { DecisionTree } from './types'
/**
 * The entries of the leaf a node reaches down the tree: every entry
 * whose pattern the node could match, in the list's order.
 *
 * Each path on the way down is read off the node once.
 *
 * @param tree the decision tree
 * @param node the node
 * @returns the entries of the leaf reached, in the list's order
 */
export function candidatesOf<E>(
  tree: DecisionTree<E>,
  node: unknown,
): readonly E[] {
  let at = tree

  while (!at.isLeaf) {
    at = at.branches.get(Literals.valueAt(node, at.path)) ?? at.rest
  }

  return at.entries
}
