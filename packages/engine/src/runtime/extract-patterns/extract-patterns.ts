import SymGet from '../sym-get'
import type { PatternEntry } from './pattern-entry'
import { patternOf } from './pattern-of'
import { ROOT_INHERITED } from './root-inherited'

/**
 * Every entry pattern of a rule's proxy trace: the branches of a root
 * `U.or(...)`, the types of a `U.fromNode(...)`, or the one node.
 *
 * Two branches of a root `U.or` with the same tag yield two entries;
 * consumers merge them per tag. A rule that is no proxy yields none.
 *
 * @param rule the rule's pattern proxy
 */
export function extractPatterns(rule: unknown): PatternEntry[] {
  const proxyNode = SymGet.proxyNodeOf(rule)
  if (!proxyNode?.tag) return []

  if (proxyNode.tag === 'or') {
    /**
     * The guards and config on the root, which apply to whichever branch
     * matched; each branch chain is extended with them after its own.
     */
    const rootGuards = proxyNode.chain.filter(c => ROOT_INHERITED.has(c.method))

    return proxyNode.args.flatMap((arg: unknown) => {
      const inner = SymGet.proxyNodeOf(arg)

      return inner
        ? [
            {
              tag: inner.tag,
              pattern: patternOf(inner),
              chain: [...inner.chain, ...rootGuards],
            },
          ]
        : []
    })
  }

  if (proxyNode.tag === 'fromNode') {
    const pattern = patternOf(proxyNode)
    const typeField = pattern.type
    const typeNode = SymGet.proxyNodeOf(typeField)

    if (typeNode?.tag === 'or') {
      const { type: _type, ...rest } = pattern

      return typeNode.args.map((t: unknown) => ({
        tag: t as string,
        pattern: rest,
        chain: proxyNode.chain,
      }))
    }

    if (typeof typeField === 'string') {
      const { type: _type, ...rest } = pattern

      return [{ tag: typeField, pattern: rest, chain: proxyNode.chain }]
    }

    return []
  }

  return [
    {
      tag: proxyNode.tag,
      pattern: patternOf(proxyNode),
      chain: proxyNode.chain,
    },
  ]
}
