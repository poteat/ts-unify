import Tree from './reads/tree'

/**
 * A tree with one node, by identity, replaced.
 *
 * @param tree the tree
 * @param target the node replaced
 * @param replacement what takes its place
 */
export function substituted<T>(
  tree: T,
  target: Tree.Node,
  replacement: Tree.Node,
): T {
  const again = (v: unknown) => substituted(v, target, replacement)
  if (tree === (target as unknown)) return replacement as T
  if (Array.isArray(tree)) return tree.map(again) as T
  if (!Tree.isNode(tree)) return tree
  const copy: Record<string, unknown> = {}

  for (const [k, v] of Object.entries(tree)) {
    copy[k] = k === 'parent' ? v : again(v)
  }

  return copy as T
}
