/**
 * One node of the tree a dispatcher walks: a leaf holds entries, an inner
 * node names a path and a subtree per value read there.
 *
 * Walking down, a node's value at the path picks the branch, or `rest`
 * for a value no branch names; the leaf reached holds the entries whose
 * literals agree with every value read on the way, in the list's order.
 */
export type DecisionTree<E> =
  | { isLeaf: true; entries: readonly E[] }
  | {
      isLeaf: false
      path: readonly string[]
      branches: ReadonlyMap<unknown, DecisionTree<E>>
      rest: DecisionTree<E>
    }
