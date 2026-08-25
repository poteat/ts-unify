import type { Get } from '@/wire/get'

import { clock } from './clock'

/**
 * A provider over the clock alone, left out of most containers.
 */
export const twice = (need: Get<[typeof clock]>) => ({
  at: need(clock).now * 2,
})
