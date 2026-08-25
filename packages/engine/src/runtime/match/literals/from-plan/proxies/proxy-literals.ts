import Plans from '@engine/runtime/match/literals/from-plan/plans'
import type { RootLiteral } from '@engine/runtime/match/literals/types'
import Util from '@engine/runtime/match/literals/util'
import type { ProxyPlan } from '@engine/runtime/match/plan'

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
 */
export function proxyLiterals(
  plan: ProxyPlan,
  path: readonly string[],
): RootLiteral[] {
  const body = plan.body

  if (body.shape === 'node') {
    return plan.tag === 'Comment'
      ? []
      : [
          Util.literalAt([...path, 'type'], [plan.tag]),
          ...(body.fields.kind === 'fields'
            ? Plans.planLiterals(body.fields, path)
            : []),
        ]
  }

  if (body.shape === 'or') {
    const literal = Ors.orLiteral(body.alternatives, path)

    return literal ? [literal] : []
  }

  return []
}
