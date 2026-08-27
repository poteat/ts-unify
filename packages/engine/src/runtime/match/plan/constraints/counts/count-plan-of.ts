import { $ } from '@ts-unify/core/internal'
import type { ProxyNode } from '@ts-unify/core/internal'
import Pattern from '@ts-unify/engine/runtime/match/pattern'
import type { CountPlan } from '@ts-unify/engine/runtime/match/plan/constraints/types'
import Fields from '@ts-unify/engine/runtime/match/plan/fields'
import Values from '@ts-unify/engine/runtime/match/plan/values'

import Boundaries from './boundaries'
/**
 * What a constraint counts: the pattern's alternatives, an or-pattern's
 * proxy arguments or the pattern alone, and the boundary's tags.
 *
 * @param pattern the constraint's proxy node
 * @param boundary the `.until()` argument, null without one
 * @returns a `CountPlan` with a tag and fields plan per alternative, and the
 *          boundary's tags
 */
export function countPlanOf(pattern: ProxyNode, boundary: unknown): CountPlan {
  const isOr = pattern.tag === 'or'

  return {
    alternatives: (isOr
      ? pattern.args.filter(Pattern.isProxyNode).map(Pattern.patternNodeOf)
      : [pattern]
    ).map(alt => {
      const isDollar = alt.args[0] === $

      return {
        tag: alt.tag,
        fields: isDollar
          ? Values.DOLLAR
          : Fields.fieldsPlanOf(alt.args[0] ?? {}),
      }
    }),

    boundaryTags: Boundaries.boundaryTagsOf(boundary),
  }
}
