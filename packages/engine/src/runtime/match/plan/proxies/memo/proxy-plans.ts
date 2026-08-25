import Memo from '@ts-unify/engine/runtime/match/plan/memo'
import Builders from '@ts-unify/engine/runtime/match/plan/proxies/builders'
/**
 * The plans of proxy nodes, kept by the proxy.
 */
export const proxyPlans = Memo.planMemo(Builders.buildProxyPlan)
