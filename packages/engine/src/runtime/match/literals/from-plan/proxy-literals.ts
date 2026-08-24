import type { ProxyPlan } from '../../plan'
import type { RootLiteral } from '../root-literal'
import { literalAt } from './literal-at'
import { orLiteral } from './or-literal'
import { planLiterals } from './plan-literals'

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
          literalAt([...path, 'type'], [plan.tag]),
          ...(body.fields.kind === 'fields'
            ? planLiterals(body.fields, path)
            : []),
        ]
  }

  if (body.shape === 'or') {
    const literal = orLiteral(body.alternatives, path)

    return literal ? [literal] : []
  }

  return []
}
