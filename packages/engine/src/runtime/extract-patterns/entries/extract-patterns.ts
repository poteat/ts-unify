import SymGet from '@ts-unify/engine/runtime/sym-get'

import type { PatternEntry } from './types'
import Util from './util'
/**
 * Every entry pattern of a rule's proxy trace: the branches of a root
 * `U.or(...)`, the types of a `U.fromNode(...)`, or the one node.
 *
 * Two branches of a root `U.or` with the same tag yield two entries;
 * consumers merge them per tag. The root's guards and config apply to
 * whichever branch matched: each branch chain ends with them.
 *
 * @param rule the rule's pattern proxy
 * @returns an entry per branch or type, each with its tag, fields record and
 *          chain; none for a rule that is no proxy
 */
export function extractPatterns(rule: unknown): PatternEntry[] {
  const proxyNode = SymGet.proxyNodeOf(rule)
  if (!proxyNode?.tag) return []

  if (proxyNode.tag === 'or') {
    const rootGuards = proxyNode.chain.filter(c =>
      Util.ROOT_INHERITED.has(c.method),
    )

    return proxyNode.args.flatMap((arg: unknown) => {
      const inner = SymGet.proxyNodeOf(arg)

      return inner
        ? [
            {
              tag: inner.tag,
              pattern: Util.patternOf(inner),
              chain: [...inner.chain, ...rootGuards],
            },
          ]
        : []
    })
  }

  if (proxyNode.tag === 'fromNode') {
    const pattern = Util.patternOf(proxyNode)
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
      pattern: Util.patternOf(proxyNode),
      chain: proxyNode.chain,
    },
  ]
}
