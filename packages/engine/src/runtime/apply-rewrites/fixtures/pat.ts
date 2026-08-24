import { NODE } from '@ts-unify/core/internal'
import type { ChainEntry, ProxyNode } from '@ts-unify/core/internal'

/**
 * The pattern shape and chain of a built proxy, in the order
 * `matchWithSites` takes them after the node.
 *
 * @param proxy a pattern built with `U`
 */
export function pat(
  proxy: unknown,
): readonly [Record<string, unknown>, ChainEntry[]] {
  const node = (proxy as Record<symbol, unknown>)[NODE] as ProxyNode

  return [(node.args[0] ?? {}) as Record<string, unknown>, node.chain]
}
