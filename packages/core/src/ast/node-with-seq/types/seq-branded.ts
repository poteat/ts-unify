import type { SEQ_BRAND } from '@/ast/seq-brand'

/**
 * The brand record of a seq combinator alone: its element patterns under
 * `SEQ_BRAND`, matched to read them off without the combinator's `to`.
 */
export type SeqBranded<Elements> = { readonly [SEQ_BRAND]: Elements }
