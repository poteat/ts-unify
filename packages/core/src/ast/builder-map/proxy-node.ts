import type { ChainEntry } from './chain-entry'

/**
 * What a builder call records: the node kind (`''` for a bare `U(...)`
 * call), the arguments, and the fluent calls chained after it.
 */
export type ProxyNode = {
  tag: string
  args: unknown[]
  chain: ChainEntry[]
}
