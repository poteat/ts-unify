import Pattern from '@ts-unify/engine/runtime/match/pattern'
/**
 * The node types an `.until()` boundary names: the proxy's tag, or the
 * tags and strings of an or-proxy's alternatives; null for no proxy.
 *
 * @param boundary the `.until()` argument
 */
export function boundaryTagsOf(boundary: unknown): ReadonlySet<string> | null {
  if (!Pattern.isProxyNode(boundary)) return null
  const node = Pattern.patternNodeOf(boundary)

  return node.tag === 'or'
    ? new Set(
        node.args.flatMap((arg: unknown) =>
          typeof arg === 'string'
            ? [arg]
            : Pattern.isProxyNode(arg)
              ? [Pattern.patternNodeOf(arg).tag]
              : [],
        ),
      )
    : new Set([node.tag])
}
