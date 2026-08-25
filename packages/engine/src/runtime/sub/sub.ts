import Util from './util'
/**
 * Structural substitution on an AST tree: a new tree in which every node
 * structurally equal to the target is the replacement.
 *
 * @param tree the tree substituted in, left as it was
 * @param target the node replaced wherever it appears
 * @param replacement what stands in its place
 */
export function sub<T>(tree: T, target: unknown, replacement: unknown): T {
  if (Util.deepEqual(tree, target)) return replacement as T
  if (Util.isLeaf(tree)) return tree

  if (Array.isArray(tree)) {
    return tree.map(v => sub(v, target, replacement)) as T
  }

  const rec = tree as Record<string, unknown>
  const result: Record<string, unknown> = {}

  for (const [k, v] of Object.entries(rec)) {
    if (Util.POSITION_KEYS.has(k)) {
      result[k] = v
      continue
    }

    result[k] = sub(v, target, replacement)
  }

  return result as T
}
