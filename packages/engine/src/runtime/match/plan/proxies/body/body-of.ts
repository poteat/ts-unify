import { $ } from '@ts-unify/core/internal'
import type { ProxyNode } from '@ts-unify/core/internal'

import Fields from '../../fields'
import { planOf } from '../../plan-of'
import Values from '../../values'
import type { ProxyBody } from './proxy-body'

/**
 * What a proxy node's body asks: an or its alternatives, a maybeBlock its
 * statement, any other tag its fields record.
 *
 * A bare `$` as the record captures every structural property; no record
 * at all is an empty one.
 *
 * @param node the proxy node's descriptor
 */
export function bodyOf(node: ProxyNode): ProxyBody {
  const inner = node.args[0]

  return node.tag === 'or'
    ? { shape: 'or', alternatives: node.args.map(planOf) }
    : node.tag === 'maybeBlock'
      ? { shape: 'maybeBlock', statement: planOf(inner) }
      : {
          shape: 'node',
          fields:
            inner === $ ? Values.DOLLAR : Fields.fieldsPlanOf(inner ?? {}),
        }
}
