import { $ } from '@ts-unify/core/internal'

import type { FieldsPlan } from './fields'
import type { ProxyPlan } from './proxies'
import Roots from './roots'
import Values from './values'
import type { DollarPlan } from './values'
/**
 * What the pattern a match starts from asks: a root proxy, a bare `$`,
 * or a fields record; read once per pattern object.
 *
 * @param pattern the pattern
 * @returns `DOLLAR` for a bare `$`, else the memoized or freshly built root
 *          plan
 */
export function rootPlanOf(
  pattern: unknown,
): ProxyPlan | FieldsPlan | DollarPlan {
  const isDollar = pattern === $
  const isProxyOrRecord =
    (typeof pattern === 'object' || typeof pattern === 'function') && pattern

  return isDollar
    ? Values.DOLLAR
    : isProxyOrRecord
      ? Roots.rootPlans.of(pattern)
      : Roots.buildRootPlan(pattern)
}
