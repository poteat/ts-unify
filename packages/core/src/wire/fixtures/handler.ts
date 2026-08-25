import type { Get } from '@/wire/get'

import { clock } from './clock'
import { request } from './request'

/**
 * A provider over a scoped value and a parent's, so a test can check which
 * memo each came from.
 */
export const handler = (need: Get<[typeof request, typeof clock]>) => ({
  request: need(request),
  clock: need(clock),
})
