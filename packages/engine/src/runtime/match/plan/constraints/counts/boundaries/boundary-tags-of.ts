import Pattern from '@ts-unify/engine/runtime/match/pattern'
/**
 * The node types an `.until()` boundary names: the proxy's tag, or the
 * tags and strings of an or-proxy's alternatives; null for no proxy.
 *
 * @param boundary the `.until()` argument
 * @returns the set of node types the boundary names, or null when it is no
 *          proxy
 */
export function boundaryTagsOf(boundary: unknown): ReadonlySet<string> | null {
  if (!Pattern.isProxyNode(boundary)) return null
  const node = Pattern.patternNodeOf(boundary)
  const isOr = node.tag === 'or'

  return isOr
    ? new Set(
        node.args.flatMap((arg: unknown) => {
          const isString = typeof arg === 'string'

          return isString
            ? [arg]
            : Pattern.isProxyNode(arg)
              ? [Pattern.patternNodeOf(arg).tag]
              : []
        }),
      )
    : new Set([node.tag])
}
