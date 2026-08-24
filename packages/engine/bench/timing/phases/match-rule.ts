import { matchWithSites } from '@ts-unify/engine'
import type { RuleMeta } from '@ts-unify/runner'

import type { MatchRecord } from './match-record'

/**
 * Every match one rule makes over the corpus, as the ESLint adapter's
 * visitor makes them.
 *
 * Each entry pattern is tried against the nodes of its tag in order, the
 * first entry to match winning.
 *
 * @param rule the rule
 * @param byType the corpus nodes by type
 * @param tried a counter of the nodes tried, added to
 */
export function matchRule(
  rule: RuleMeta,
  byType: ReadonlyMap<string, readonly object[]>,
  tried: { count: number },
): MatchRecord[] {
  const records: MatchRecord[] = []
  const seen = new Set<string>()

  for (const { tag } of rule.patterns) {
    if (seen.has(tag)) continue
    seen.add(tag)
    const candidates = rule.patterns.filter(p => p.tag === tag)

    for (const node of byType.get(tag) ?? []) {
      tried.count++

      for (const entry of candidates) {
        if (matchWithSites(node, entry.pattern, entry.chain)) {
          records.push({ rule, node, entry })
          break
        }
      }
    }
  }

  return records
}
