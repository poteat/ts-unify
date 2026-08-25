import Nodes from './nodes'
import type { Node } from './nodes'

/**
 * Every node under a tree, depth first, each with the node above it; the
 * walk follows the parser's child keys and never the link back up.
 *
 * @param tree a node, an array of them, or anything else, which has none
 * @param parent the node above the tree; none at the top
 */
export function* walk(
  tree: unknown,
  parent: Node | null = null,
): Generator<[Node, Node | null]> {
  if (Array.isArray(tree)) {
    for (const v of tree) yield* walk(v, parent)

    return
  }

  if (!Nodes.isNode(tree)) return
  yield [tree, parent]

  for (const v of Nodes.children(tree)) yield* walk(v, tree)
}
