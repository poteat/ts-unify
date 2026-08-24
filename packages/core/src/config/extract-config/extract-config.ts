import type { ConfigSlot } from '@/config/config-type'
import type { ExtractFromPattern } from '@/pattern/extract-from-pattern'
import type { Prettify } from '@/type-utils'

/**
 * The config a pattern or output shape asks for: a bag keyed by each slot's
 * name, valued by the slot's `Value`.
 */
export type ExtractConfig<Pattern> = Prettify<
  ExtractFromPattern<Pattern, ConfigSlot>
>
