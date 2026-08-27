import { NODE } from '@ts-unify/core/internal'
import type { ChainEntry, ProxyNode } from '@ts-unify/core/internal'

import ExtractPatterns from '../../extract-patterns'

/**
 * The pattern shape and chain of a built proxy, in the order
 * `matchWithSites` takes them after the node.
 *
 * @param proxy a pattern built with `U`
 * @returns the proxy's fields record and its chain, as a pair
 */
export function pat(
  proxy: unknown,
): readonly [Record<string, unknown>, ChainEntry[]] {
  const node = (proxy as Record<symbol, unknown>)[NODE] as ProxyNode

  return [ExtractPatterns.patternOf(node), node.chain]
}
