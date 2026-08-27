import Memo from './memo'
import type { ProxyPlan } from './types'
/**
 * What a proxy node asks, read once per proxy.
 *
 * @param proxy a proxy node, as `isProxyNode` admits
 * @returns the proxy's memoized `ProxyPlan`
 */
export const proxyPlanOf = (proxy: unknown): ProxyPlan =>
  Memo.proxyPlans.of(proxy as object)
