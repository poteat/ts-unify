import { ping } from './ping'
import type { PongProvider } from './pong-provider'

/**
 * The provider that closes the cycle.
 */
export const pong: PongProvider = need => ({ pongs: need(ping).pings + 1 })
