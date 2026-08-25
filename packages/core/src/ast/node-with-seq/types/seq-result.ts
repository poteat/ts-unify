import type { SEQ_BRAND } from '@/ast/seq-brand'
import type { ExtractCaptures } from '@/pattern'
import type { Prettify } from '@/type-utils'

/**
 * What `U.seq(A, B, ...)` returns at the type level: the element types
 * under `SEQ_BRAND`, where `ExtractCaptures` finds and merges them.
 */
export type SeqResult<Elements extends readonly unknown[]> = {
  readonly [SEQ_BRAND]: Elements

  /**
   * Attaches an inline rewrite factory, which receives the merged captures
   * of every seq element, typed through `ExtractCaptures`.
   */
  to<Result>(
    factory: (bag: Prettify<ExtractCaptures<SeqResult<Elements>>>) => Result,
  ): SeqResult<Elements>
}
