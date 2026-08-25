import Pattern from '@engine/runtime/match/pattern'
import Chains from '@engine/runtime/match/plan/chains'
import type { ProxyPlan } from '@engine/runtime/match/plan/proxies/types'

import Bodies from './bodies'
/**
 * What a proxy node asks, read through its `NODE` descriptor.
 *
 * @param proxy a proxy node, as `isProxyNode` admits
 */
export function buildProxyPlan(proxy: object): ProxyPlan {
  const node = Pattern.patternNodeOf(proxy)

  return {
    kind: 'proxy',
    tag: node.tag,
    body: Bodies.bodyOf(node),
    chain: Chains.chainPlanOf(node.chain),
  }
}
