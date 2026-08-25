import Atom from '@/atom/atom'
import Slot from '@/atom/slot'
import type { ValueOf } from '@/atom/value-of'

import type { Clock } from './clock'
import type { Request } from './request'

/**
 * A value over a scoped slot and a parent's, so a test can check which
 * memo each came from.
 */
export type Handler = Slot.Atom<{
  readonly request: ValueOf<Request>
  readonly clock: ValueOf<Clock>
}>

/**
 * The slot `handler` fills.
 */
export const Handler = Atom.atom<Handler>('Handler')
