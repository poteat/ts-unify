import Pattern from '../../pattern'
import Chains from '../chains'
import Body from './body'
import type { ProxyPlan } from './proxy-plan'

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
    body: Body.bodyOf(node),
    chain: Chains.chainPlanOf(node.chain),
  }
}
