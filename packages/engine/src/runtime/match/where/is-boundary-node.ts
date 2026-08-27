import Node from '@ts-unify/engine/runtime/match/node'
import Pattern from '@ts-unify/engine/runtime/match/pattern'
/**
 * Whether a node is where an `.until()` boundary stops the descent: its
 * type is the boundary proxy's tag, or one of an or-proxy's.
 *
 * @param node the node
 * @param boundary the `.until()` argument
 * @returns true when the node's type is a tag the boundary names; false for no
 *          proxy
 */
export function isBoundaryNode(node: unknown, boundary: unknown) {
  if (!Pattern.isProxyNode(boundary)) return false

  const bNode = Pattern.patternNodeOf(boundary)
  const actualType = Node.nodeType(node)
  const isOr = bNode.tag === 'or'

  return isOr
    ? bNode.args.some((arg: unknown) => {
        const isTagName = typeof arg === 'string'

        return isTagName
          ? actualType === arg
          : Pattern.isProxyNode(arg)
            ? actualType === Pattern.patternNodeOf(arg).tag
            : false
      })
    : actualType === bNode.tag
}
