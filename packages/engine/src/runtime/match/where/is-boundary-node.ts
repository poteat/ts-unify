import Node from '../node'
import Pattern from '../pattern'

/**
 * Whether a node is where an `.until()` boundary stops the descent: its
 * type is the boundary proxy's tag, or one of an or-proxy's.
 *
 * @param node the node
 * @param boundary the `.until()` argument
 */
export function isBoundaryNode(node: unknown, boundary: unknown) {
  if (!Pattern.isProxyNode(boundary)) return false

  const bNode = Pattern.proxyNodeOf(boundary)
  const actualType = Node.nodeType(node)

  return bNode.tag === 'or'
    ? bNode.args.some((arg: unknown) =>
        typeof arg === 'string'
          ? actualType === arg
          : Pattern.isProxyNode(arg)
            ? actualType === Pattern.proxyNodeOf(arg).tag
            : false,
      )
    : actualType === bNode.tag
}
