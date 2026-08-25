import Context from '@engine/runtime/match/context'
import Inner from '@engine/runtime/match/inner'
import Node from '@engine/runtime/match/node'
import Plan from '@engine/runtime/match/plan'
import type { MatchResult } from '@engine/runtime/match/types'
import Where from '@engine/runtime/match/where'
import type { ChainEntry } from '@ts-unify/core/internal'
/**
 * Matches a node the pattern's root literals admit, and returns the
 * capture bag with the inner `.to()` rewrite sites, or null on mismatch.
 *
 * A root-level `.to()` in the chain is a site at path `[]` like any other,
 * so the rewrite pipeline has no root case. Every site reads the final
 * root bag, which applyRewrites rebinds in place as deeper sites land.
 *
 * @param node the AST node
 * @param pattern a fields record or a root proxy
 * @param chain the root proxy's chain
 */
export function matchAdmitted(
  node: unknown,
  pattern: unknown,
  chain: ChainEntry[] = [],
): MatchResult | null {
  const plan = Plan.chainPlanOf(chain)
  const ctx = Context.matchContextOf(
    plan,
    Node.nodeType(node) === 'Program' ? node : undefined,
  )
  const at: Context.Cursor = { ctx, path: [] }
  const root = Plan.rootPlanOf(pattern)
  const bag =
    root.kind === 'proxy'
      ? Inner.matchProxyPlan(node, root, at)
      : root.kind === 'dollar'
        ? Context.captureRest(node, at, Context.NO_KEYS)
        : Inner.matchFields(node, root, at)
  if (!bag) return null
  if (!Context.bindingsAgree(ctx.namedBindings)) return null

  for (const guard of plan.whens) {
    if (!guard(bag)) return null
  }

  if (!Where.applyConstraints(plan.constraints, node)) return null

  for (const site of ctx.sites) site.scopeBag = bag

  if (plan.factory) {
    ctx.recordSite({ path: [], factory: plan.factory, scopeBag: bag })
  }

  return { bag, sites: ctx.sites, capturePaths: ctx.capturePaths }
}
