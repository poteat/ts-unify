import type { ProxyPlan } from './proxy-plan'
import { proxyPlans } from './proxy-plans'

/**
 * What a proxy node asks, read once per proxy.
 *
 * @param proxy a proxy node, as `isProxyNode` admits
 */
export const proxyPlanOf = (proxy: unknown): ProxyPlan =>
  proxyPlans.of(proxy as object)
