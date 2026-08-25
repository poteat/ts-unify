import type { PingProvider } from './ping-provider'
import { pong } from './pong'

/**
 * A provider that asks for the one asking for it.
 */
export const ping: PingProvider = need => ({ pings: need(pong).pongs + 1 })
