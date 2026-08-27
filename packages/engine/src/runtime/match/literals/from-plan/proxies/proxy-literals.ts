import Plans from '@ts-unify/engine/runtime/match/literals/from-plan/plans'
import type { RootLiteral } from '@ts-unify/engine/runtime/match/literals/types'
import Util from '@ts-unify/engine/runtime/match/literals/util'
import type { ProxyPlan } from '@ts-unify/engine/runtime/match/plan'

import Ors from './ors'
/**
 * Every literal a proxy plan requires under a path: a node proxy its
 * type, then its fields'; a `U.or` what `orLiteral` makes of it.
 *
 * A `U.maybeBlock` requires none here, its statement sitting one block
 * down at times; nor does a `Comment`, which a match sees through its
 * node view, whose fields the raw comment lacks.
 *
 * @param plan the proxy plan
 * @param path the path under the node the plan applies at
 * @returns the `type` literal and the fields' literals, the or's literal if
 *          any, or none
 */
export function proxyLiterals(
  plan: ProxyPlan,
  path: readonly string[],
): RootLiteral[] {
  const body = plan.body

  if (body.shape === 'node') {
    const isComment = plan.tag === 'Comment'
    const hasFields = body.fields.kind === 'fields'

    return isComment
      ? []
      : [
          Util.literalAt([...path, 'type'], [plan.tag]),
          ...(hasFields ? Plans.planLiterals(body.fields, path) : []),
        ]
  }

  if (body.shape === 'or') {
    const literal = Ors.orLiteral(body.alternatives, path)

    return literal ? [literal] : []
  }

  return []
}
