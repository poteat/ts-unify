import { deepEqual } from './deep-equal'
import { POSITION_KEYS } from './position-keys'

/**
 * Whether a node structurally equal to the target appears anywhere in
 * the tree, the tree itself included.
 *
 * @param tree the tree searched
 * @param target the node looked for
 */
export function contains(tree: unknown, target: unknown): boolean {
  if (deepEqual(tree, target)) return true
  if (tree == null || typeof tree !== 'object') return false
  if (Array.isArray(tree)) return tree.some(v => contains(v, target))

  for (const [k, v] of Object.entries(tree as Record<string, unknown>)) {
    if (POSITION_KEYS.has(k)) continue
    if (contains(v, target)) return true
  }

  return false
}
