import Pattern from '@engine/runtime/match/pattern'
import type { CountPlan } from '@engine/runtime/match/plan/constraints/types'
import Fields from '@engine/runtime/match/plan/fields'
import Values from '@engine/runtime/match/plan/values'
import { $ } from '@ts-unify/core/internal'
import type { ProxyNode } from '@ts-unify/core/internal'

import Boundaries from './boundaries'
/**
 * What a constraint counts: the pattern's alternatives, an or-pattern's
 * proxy arguments or the pattern alone, and the boundary's tags.
 *
 * @param pattern the constraint's proxy node
 * @param boundary the `.until()` argument, null without one
 */
export const countPlanOf = (
  pattern: ProxyNode,
  boundary: unknown,
): CountPlan => ({
  alternatives: (pattern.tag === 'or'
    ? pattern.args.filter(Pattern.isProxyNode).map(Pattern.patternNodeOf)
    : [pattern]
  ).map(alt => ({
    tag: alt.tag,

    fields:
      alt.args[0] === $
        ? Values.DOLLAR
        : Fields.fieldsPlanOf(alt.args[0] ?? {}),
  })),

  boundaryTags: Boundaries.boundaryTagsOf(boundary),
})
