import type { Get } from '@/wire/get'

import { clock } from './clock'
import { settings } from './settings'

/**
 * A provider over two others; it keeps the clock it was handed, so a test
 * can check it is the one the container holds.
 */
export const stamp = (need: Get<[typeof clock, typeof settings]>) => ({
  clock: need(clock),
  text: `${need(settings).name}@${need(clock).now}`,
})
