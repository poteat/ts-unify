import type { ArrayPlan, Plan } from '../../plan'
import type { RootLiteral } from '../root-literal'
import { literalAt } from './literal-at'
import { proxyLiterals } from './proxy-literals'

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
 */
export function planLiterals(
  plan: Plan | ArrayPlan,
  path: readonly string[],
): RootLiteral[] {
  switch (plan.kind) {
    case 'literal':
      return [literalAt(path, [plan.value])]
    case 'fields':
      return plan.fields.flatMap(field =>
        planLiterals(field.plan, [...path, field.key]),
      )
    case 'array':
      return plan.before.flatMap((element, index) =>
        planLiterals(element, [...path, String(index)]),
      )
    case 'proxy':
      return proxyLiterals(plan, path)
    default:
      return []
  }
}
