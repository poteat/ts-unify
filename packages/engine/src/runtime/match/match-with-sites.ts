import type { ChainEntry } from '@ts-unify/core/internal'

import Chain from './chain'
import Context from './context'
import Inner from './inner'
import type { MatchResult } from './match-result'
import Node from './node'
import Pattern from './pattern'
import Where from './where'

/**
 * Matches an AST node against a pattern and returns the capture bag with
 * the inner `.to()` rewrite sites, or null on mismatch.
 *
 * A root-level `.to()` in the chain is a site at path `[]` like any other,
 * so the rewrite pipeline has no root case. Every site reads the final
 * root bag, which applyRewrites rebinds in place as deeper sites land.
 *
 * @param node the AST node
 * @param pattern a fields record or a root proxy
 * @param chain the root proxy's chain
 */
export function matchWithSites(
  node: unknown,
  pattern: unknown,
  chain: ChainEntry[] = [],
): MatchResult | null {
  const ctx = Context.createMatchContext(
    chain,
    Node.nodeType(node) === 'Program' ? node : undefined,
  )
  const at: Context.Cursor = { ctx, path: [] }
  const bag = Pattern.isProxyNode(pattern)
    ? Inner.matchProxyNode(node, pattern, at)
    : Inner.matchInner(node, pattern, at)
  if (!bag) return null
  if (!Context.bindingsAgree(ctx.namedBindings)) return null
  if (!Chain.applyWhenGuards(chain, bag)) return null
  if (!Where.applyWhere(chain, node)) return null

  for (const site of ctx.sites) site.scopeBag = bag

  const factory = Chain.toFactory(chain)
  if (factory) ctx.recordSite({ path: [], factory, scopeBag: bag })

  return { bag, sites: ctx.sites, capturePaths: ctx.capturePaths }
}
