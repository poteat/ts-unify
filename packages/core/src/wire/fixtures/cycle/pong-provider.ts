import type { Get } from '@/wire/get'

import type { PingProvider } from './ping-provider'

/**
 * The other half of a cycle.
 */
export type PongProvider = (need: Get<[PingProvider]>) => { pongs: number }
