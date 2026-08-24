import { planMemo } from '../plan-memo'
import { buildProxyPlan } from './build-proxy-plan'

/**
 * The plans of proxy nodes, kept by the proxy.
 */
export const proxyPlans = planMemo(buildProxyPlan)
