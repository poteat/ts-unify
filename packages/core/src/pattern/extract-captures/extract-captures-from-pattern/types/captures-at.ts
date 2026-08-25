import type { ExtractCapturesFromPattern } from '@/pattern/extract-captures/extract-captures-from-pattern/extract-captures-from-pattern'

/**
 * The capture bag of the item at `K` in a sequence pattern, where a bare
 * `$` takes the index as its name.
 */
export type CapturesAt<
  Items extends readonly unknown[],
  K extends keyof Items,
> = ExtractCapturesFromPattern<Items[K], `${K & string}`>
