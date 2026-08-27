import { $ } from '@ts-unify/core/internal'
import type { ProxyNode } from '@ts-unify/core/internal'
import Fields from '@ts-unify/engine/runtime/match/plan/fields'
import { planOf } from '@ts-unify/engine/runtime/match/plan/plan-of'
import type { ProxyBody } from '@ts-unify/engine/runtime/match/plan/proxies/types'
import Values from '@ts-unify/engine/runtime/match/plan/values'
/**
 * What a proxy node's body asks: an or its alternatives, a maybeBlock its
 * statement, any other tag its fields record.
 *
 * A bare `$` as the record captures every structural property; no record
 * at all is an empty one.
 *
 * @param node the proxy node's descriptor
 * @returns an or, maybeBlock or node body, the last with its fields plan or
 *          `DOLLAR`
 */
export function bodyOf(node: ProxyNode): ProxyBody {
  const inner = node.args[0]
  const isOr = node.tag === 'or'
  const isMaybeBlock = node.tag === 'maybeBlock'

  return isOr
    ? { shape: 'or', alternatives: node.args.map(planOf) }
    : isMaybeBlock
      ? { shape: 'maybeBlock', statement: planOf(inner) }
      : {
          shape: 'node',
          fields:
            inner === $ ? Values.DOLLAR : Fields.fieldsPlanOf(inner ?? {}),
        }
}
