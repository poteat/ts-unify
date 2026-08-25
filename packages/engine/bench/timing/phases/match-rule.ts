import { dispatcherOf, matchAdmitted } from '@ts-unify/engine'
import type { RuleMeta } from '@ts-unify/runner'

import type { MatchRecord } from './types'
/**
 * Every match one rule makes over the corpus, as the ESLint adapter's
 * visitor makes them.
 *
 * Each node of an entry's tag goes through the dispatcher over the rule's
 * entries of that tag, and the entries it admits are tried in order, the
 * first to match winning.
 *
 * @param rule the rule
 * @param byType the corpus nodes by type
 * @param tried counters of the nodes tried and of the entries admitted,
 * added to
 */
export function matchRule(
  rule: RuleMeta,
  byType: ReadonlyMap<string, readonly object[]>,
  tried: { count: number; admitted: number },
): MatchRecord[] {
  const records: MatchRecord[] = []
  const seen = new Set<string>()

  for (const { tag } of rule.patterns) {
    if (seen.has(tag)) continue
    seen.add(tag)
    const admitted = dispatcherOf(rule.patterns.filter(p => p.tag === tag))

    for (const node of byType.get(tag) ?? []) {
      tried.count++

      for (const entry of admitted(node)) {
        tried.admitted++

        if (matchAdmitted(node, entry.pattern, entry.chain)) {
          records.push({ rule, node, entry })
          break
        }
      }
    }
  }

  return records
}
