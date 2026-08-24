import type { Prettify } from '@/type-utils'

import type { ExtractCapturesFromPattern } from './extract-captures-from-pattern'

/**
 * The bag a pattern captures: a property per capture name, typed by the
 * capture's value.
 *
 * @example
 * type R = ExtractCaptures<{ v: Capture<'v', number> }> // { v: number }
 * @example
 * type R = ExtractCaptures<{ id: $ }> // { id: unknown }
 */
export type ExtractCaptures<Pattern> = Prettify<
  ExtractCapturesFromPattern<Pattern>
>
