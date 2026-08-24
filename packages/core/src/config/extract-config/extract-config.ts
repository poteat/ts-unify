import type { ConfigSlot } from '@/config/config-type'
import type { ExtractFromPattern } from '@/pattern/extract-from-pattern'
import type { Prettify } from '@/type-utils'

/**
 * Extract config slot names and types from a pattern or output shape.
 */
export type ExtractConfig<Pattern> = Prettify<
  ExtractFromPattern<Pattern, ConfigSlot>
>
