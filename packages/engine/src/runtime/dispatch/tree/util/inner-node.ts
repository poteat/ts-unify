import type { DecisionTree } from '@engine/runtime/dispatch/tree/types'
/**
 * A node of the tree that reads a path: the subtree per value any entry
 * allows at it, and the subtree for any other value.
 *
 * @param path the path read at the node
 * @param branches the subtree per value
 * @param rest the subtree for a value no branch names
 */
export const innerNode = <E>(
  path: readonly string[],
  branches: ReadonlyMap<unknown, DecisionTree<E>>,
  rest: DecisionTree<E>,
): DecisionTree<E> => ({ isLeaf: false, path, branches, rest })
