import type { Get } from '@/wire/get'

import { two } from './two'

/**
 * A provider over `two`, which `one` satisfies at the type level alone.
 */
export const needsTwo = (need: Get<[typeof two]>) => ({
  doubled: need(two).n * 2,
})
