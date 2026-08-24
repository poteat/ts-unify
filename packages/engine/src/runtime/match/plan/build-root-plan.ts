import Pattern from '../pattern'
import Fields from './fields'
import type { FieldsPlan } from './fields'
import Proxies from './proxies'
import type { ProxyPlan } from './proxies'

/**
 * What a root pattern asks: a root proxy's plan, or a fields record's.
 *
 * @param pattern the pattern, a `$` aside
 */
export const buildRootPlan = (pattern: unknown): ProxyPlan | FieldsPlan =>
  Pattern.isProxyNode(pattern)
    ? Proxies.proxyPlanOf(pattern)
    : Fields.fieldsPlanOf(pattern)
