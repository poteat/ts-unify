import { dispatcherOf } from '@ts-unify/engine'
import type { Dispatcher } from '@ts-unify/engine'
import type { RuleMeta } from '@ts-unify/runner/types'

import type { RuleEntry } from './types'

/**
 * One dispatcher per tag over every entry pattern of a rule set, the
 * entries in rule order and then in each rule's own.
 *
 * Built per lint: a rule set is small beside a file.
 *
 * @param rules the rule set
 */
export function dispatchersOf(
  rules: readonly RuleMeta[],
): ReadonlyMap<string, Dispatcher<RuleEntry<RuleMeta>>> {
  const byTag = new Map<string, RuleEntry<RuleMeta>[]>()

  for (const rule of rules) {
    for (const { tag, pattern, chain } of rule.patterns) {
      byTag.set(tag, [...(byTag.get(tag) ?? []), { rule, pattern, chain }])
    }
  }

  return new Map(
    [...byTag].map(([tag, entries]) => [tag, dispatcherOf(entries)]),
  )
}
