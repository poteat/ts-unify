import Sub from '../../sub'
import type { Constraint } from './constraint'
import { countDescendant } from './count-descendant'

/**
 * How many descendants of a node match a constraint, the node itself not
 * counted.
 *
 * @param node the node whose children are walked
 * @param constraint the pattern and its boundary
 * @param limit a count at which to stop early
 */
export function countChildren(
  node: unknown,
  constraint: Constraint,
  limit?: number,
): number {
  if (!node || typeof node !== 'object') return 0
  const nodeRec = node as Record<string, unknown>
  let count = 0

  for (const key of Object.keys(nodeRec)) {
    if (Sub.POSITION_KEYS.has(key)) continue
    const child = nodeRec[key]

    for (const item of Array.isArray(child) ? child : [child]) {
      count += countDescendant(
        item,
        constraint,
        limit ? limit - count : undefined,
      )
      if (limit && count >= limit) return count
    }
  }

  return count
}
