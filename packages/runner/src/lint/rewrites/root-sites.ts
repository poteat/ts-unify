import type { MatchResult, RewriteSite } from '@ts-unify/engine'
import type { Factory } from '@ts-unify/runner/types'

/**
 * A match's rewrite sites, with the rule's own `.to()` at the root when the
 * branch's chain did not carry it.
 *
 * An `or`-rooted rule keeps the outer `.to()` apart from its branches, and
 * `extractRuleMeta` hands it over as the factory.
 *
 * @param result the match
 * @param factory the rule's root `.to()`, if any
 */
export function rootSites(
  result: MatchResult,
  factory: Factory | null,
): RewriteSite[] {
  const sites = [...result.sites]

  if (factory && !sites.some(s => s.path.length === 0)) {
    sites.push({ path: [], factory, scopeBag: result.bag })
  }

  return sites
}
