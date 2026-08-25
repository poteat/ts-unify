import type { Get } from '@/wire/get'

import type { PongProvider } from './pong-provider'

/**
 * One half of a cycle; the other half declares this one.
 */
export type PingProvider = (need: Get<[PongProvider]>) => { pings: number }
