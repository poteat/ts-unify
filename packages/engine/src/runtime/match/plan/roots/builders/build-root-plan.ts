import Pattern from '@ts-unify/engine/runtime/match/pattern'
import Fields from '@ts-unify/engine/runtime/match/plan/fields'
import type { FieldsPlan } from '@ts-unify/engine/runtime/match/plan/fields'
import Proxies from '@ts-unify/engine/runtime/match/plan/proxies'
import type { ProxyPlan } from '@ts-unify/engine/runtime/match/plan/proxies'
/**
 * What a root pattern asks: a root proxy's plan, or a fields record's.
 *
 * @param pattern the pattern, a `$` aside
 */
export const buildRootPlan = (pattern: unknown): ProxyPlan | FieldsPlan =>
  Pattern.isProxyNode(pattern)
    ? Proxies.proxyPlanOf(pattern)
    : Fields.fieldsPlanOf(pattern)
