import type { ChainPlan } from '@engine/runtime/match/plan/chains'

import type { ProxyBody } from './bodies'
/**
 * The plan of a proxy node: its tag, what its body asks of the value,
 * and what its chain does to the captures.
 */
export type ProxyPlan = {
  kind: 'proxy'
  tag: string
  body: ProxyBody
  chain: ChainPlan
}
