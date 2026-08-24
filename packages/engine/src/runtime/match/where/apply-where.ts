import type { ChainEntry } from '@ts-unify/core/internal'

import Chain from '../chain'
import Pattern from '../pattern'
import { countChildren } from './count-children'
import { readQuantifier } from './read-quantifier'

/**
 * Whether a node satisfies every `.where()` entry of a chain.
 *
 * Each entry carries constraint patterns, each with a quantifier and an
 * optional `.until()` boundary; a constraint without a quantifier is
 * skipped.
 *
 * @param chain the chain
 * @param actual the matched node, whose descendants are counted
 */
export function applyWhere(chain: ChainEntry[], actual: unknown) {
  for (const entry of chain) {
    if (entry.method !== 'where') continue

    for (const constraint of entry.args) {
      if (!Pattern.isProxyNode(constraint)) continue
      const pattern = Pattern.proxyNodeOf(constraint)
      const boundary = Chain.chainGet(pattern.chain, 'until')?.args[0] ?? null
      const q = readQuantifier(pattern.chain)
      if (!q) continue

      if (
        !q.test(
          countChildren(
            actual,
            { pattern, boundary },
            q.kind === 'none' ? 1 : undefined,
          ),
        )
      ) {
        return false
      }
    }
  }

  return true
}
