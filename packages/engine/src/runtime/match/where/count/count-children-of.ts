import Sub from '../../../sub'
import type { Count } from './count'
import { countDescendantOf } from './count-descendant-of'

/**
 * How many descendants of a node match what a count counts, the node
 * itself not counted.
 *
 * @param node the node whose children are walked
 * @param count what is counted, and under which cursor
 * @param limit a count at which to stop early
 */
export function countChildrenOf(
  node: unknown,
  count: Count,
  limit?: number,
): number {
  if (!node || typeof node !== 'object') return 0
  const nodeRec = node as Record<string, unknown>
  let found = 0

  function done(item: unknown) {
    found += countDescendantOf(item, count, limit ? limit - found : undefined)

    return limit ? found >= limit : false
  }

  for (const key of Object.keys(nodeRec)) {
    if (Sub.POSITION_KEYS.has(key)) continue
    const child = nodeRec[key]

    if (Array.isArray(child)) {
      for (const item of child) if (done(item)) return found
    } else if (done(child)) {
      return found
    }
  }

  return found
}
