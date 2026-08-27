import Proxies from '@ts-unify/engine/runtime/match/literals/from-plan/proxies'
import type { RootLiteral } from '@ts-unify/engine/runtime/match/literals/types'
import Util from '@ts-unify/engine/runtime/match/literals/util'
import type { ArrayPlan, Plan } from '@ts-unify/engine/runtime/match/plan'
/**
 * Every literal a plan requires under a path, which a match reads the
 * same way before anything else could tell the node apart.
 *
 * A literal plan requires its value; a fields record its properties'
 * literals; an array pattern its elements' before the first spread, at
 * their indices; a proxy what `proxyLiterals` says; a capture nothing.
 *
 * @param plan the plan
 * @param path the path under the node the plan applies at
 * @returns the literals the plan requires, each at its path; none for a capture
 *          or the like
 */
export function planLiterals(
  plan: Plan | ArrayPlan,
  path: readonly string[],
): RootLiteral[] {
  switch (plan.kind) {
    case 'literal':
      return [Util.literalAt(path, [plan.value])]
    case 'fields':
      return plan.fields.flatMap(field =>
        planLiterals(field.plan, [...path, field.key]),
      )
    case 'array':
      return plan.before.flatMap((element, index) =>
        planLiterals(element, [...path, String(index)]),
      )
    case 'proxy':
      return Proxies.proxyLiterals(plan, path)
    default:
      return []
  }
}
