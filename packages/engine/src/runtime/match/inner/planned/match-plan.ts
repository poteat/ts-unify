import type { Cursor } from '@engine/runtime/match/context'
import type { Plan } from '@engine/runtime/match/plan'
import type { Bag } from '@engine/runtime/types'

import Fields from './fields'
import Proxies from './proxies'
/**
 * Matches one value against the plan of one pattern value, and returns
 * the captures, or null on mismatch.
 *
 * A bare `$` captures under the cursor's key, or under `_` without one.
 *
 * @param actual the value
 * @param plan the plan of the pattern value
 * @param at where the value sits in the match
 */
export function matchPlan(actual: unknown, plan: Plan, at: Cursor): Bag | null {
  switch (plan.kind) {
    case 'dollar':
      if (at.key) at.ctx.capturePaths[at.key] = at.path

      return { [at.key || '_']: actual }
    case 'capture':
      at.ctx.bind(plan.name, actual)
      at.ctx.capturePaths[plan.name] = at.path

      return { [plan.name]: actual }
    case 'config':
      return actual === at.ctx.configDefaults[plan.name] ? {} : null
    case 'string':
      return plan.test(actual) ? {} : null
    case 'proxy':
      return Proxies.matchProxyPlan(actual, plan, at)
    case 'fields':
      return Fields.matchFields(actual, plan, at)
    case 'literal':
      return actual === plan.value ? {} : null
  }
}
