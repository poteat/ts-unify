import { $ } from '@ts-unify/core/internal'

import { buildRootPlan } from './build-root-plan'
import type { FieldsPlan } from './fields'
import type { ProxyPlan } from './proxies'
import { rootPlans } from './root-plans'
import Values from './values'
import type { DollarPlan } from './values'

/**
 * What the pattern a match starts from asks: a root proxy, a bare `$`,
 * or a fields record; read once per pattern object.
 *
 * @param pattern the pattern
 */
export const rootPlanOf = (
  pattern: unknown,
): ProxyPlan | FieldsPlan | DollarPlan =>
  pattern === $
    ? Values.DOLLAR
    : (typeof pattern === 'object' || typeof pattern === 'function') && pattern
      ? rootPlans.of(pattern)
      : buildRootPlan(pattern)
