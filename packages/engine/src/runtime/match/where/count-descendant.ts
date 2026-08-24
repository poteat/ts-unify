import type { ProxyNode } from '@ts-unify/core/internal'

import Context from '../context'
import Inner from '../inner'
import Node from '../node'
import Pattern from '../pattern'
import type { Constraint } from './constraint'
import { countChildren } from './count-children'
import { isBoundaryNode } from './is-boundary-node'

/**
 * How many of a node and its descendants match a constraint.
 *
 * A node matches at most once, an or-pattern's alternatives tried in
 * order; the descent stops under a boundary node, which is itself still
 * checked.
 *
 * @param node the node
 * @param constraint the pattern and its boundary
 * @param limit a count at which to stop early
 */
export function countDescendant(
  node: unknown,
  constraint: Constraint,
  limit?: number,
): number {
  if (!Node.nodeType(node)) return 0
  const { pattern, boundary } = constraint
  const alternatives: ProxyNode[] =
    pattern.tag === 'or'
      ? pattern.args.filter(Pattern.isProxyNode).map(Pattern.proxyNodeOf)
      : [pattern]
  const at: Context.Cursor = { ctx: Context.createMatchContext(), path: [] }
  const matches = (alt: ProxyNode) =>
    Node.nodeType(node) === alt.tag &&
    Inner.matchInner(node, alt.args[0] ?? {}, at) !== null
  const count = alternatives.some(matches) ? 1 : 0
  const isDone =
    (limit !== undefined && count >= limit) || isBoundaryNode(node, boundary)

  return isDone
    ? count
    : count + countChildren(node, constraint, limit ? limit - count : undefined)
}
