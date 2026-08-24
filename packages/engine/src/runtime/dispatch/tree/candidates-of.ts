import Literals from '../../match/literals'
import type { DecisionTree } from './decision-tree'

/**
 * The entries of the leaf a node reaches down the tree: every entry
 * whose pattern the node could match, in the list's order.
 *
 * Each path on the way down is read off the node once.
 *
 * @param tree the decision tree
 * @param node the node
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
