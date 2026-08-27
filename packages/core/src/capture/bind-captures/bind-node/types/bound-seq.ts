import type { SEQ_BRAND } from '@/ast/seq-brand'
import type { BindSeqElements } from '@/capture/bind-captures/sequence'

/**
 * A seq combinator bound against the element shape: each element bound
 * under the brand, the pattern's `to` kept as `To`.
 */
export type BoundSeq<Elements extends readonly unknown[], S, To> = {
  readonly [SEQ_BRAND]: BindSeqElements<Elements, S>
  to: To
}
