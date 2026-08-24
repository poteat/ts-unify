import type { CaptureLike } from '@/capture/capture-like'
import type { ConfigSlot } from '@/config/config-type'

/**
 * What a pattern may hold at a position whose value type is `T`: the value
 * itself, a capture token, or a config slot.
 *
 * @typeParam T value type of the position
 */
export type Capturable<T> = T | CaptureLike<T> | ConfigSlot
