import Context from '@ts-unify/engine/runtime/match/context'
import Inner from '@ts-unify/engine/runtime/match/inner'
import Node from '@ts-unify/engine/runtime/match/node'
import Children from '@ts-unify/engine/runtime/match/where/constraints/count/children'
import type { Count } from '@ts-unify/engine/runtime/match/where/constraints/count/types'
/**
 * How many of a node and its descendants match what a count counts.
 *
 * A node matches at most once, the alternatives tried in order; the
 * descent stops under a boundary node, which is itself still checked.
 *
 * @param node the node
 * @param count what is counted, and under which cursor
 * @param limit a count at which to stop early
 */
export function countDescendantOf(
  node: unknown,
  count: Count,
  limit?: number,
): number {
  const nodeKind = Node.nodeType(node)
  if (!nodeKind) return 0
  const { plan, at } = count
  const found = plan.alternatives.some(
    alt =>
      nodeKind === alt.tag &&
      (alt.fields.kind === 'dollar'
        ? Context.captureRest(node, at, Context.NO_KEYS)
        : Inner.matchFields(node, alt.fields, at)) !== null,
  )
    ? 1
    : 0

  return (limit !== undefined && found >= limit) ||
    (plan.boundaryTags !== null && plan.boundaryTags.has(nodeKind as string))
    ? found
    : found +
        Children.countChildrenOf(node, count, limit ? limit - found : undefined)
}
