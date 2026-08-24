import type { FLUENT_INNER } from '@/ast/fluent-node'
import type { OR_BRAND } from '@/ast/or'
import type { Sealed } from '@/ast/sealed'
import type { SEQ_BRAND } from '@/ast/seq-brand'
import type { StripOr } from '@/pattern/strip-or'
import type { StripSeal } from '@/pattern/strip-seal'

import type { BindValue } from './bind-value'
import type { BindSeqElements } from './sequence'

/**
 * A pattern node unwrapped to the value that binds.
 *
 * A fluent node binds by the pattern under its brand; an or-node by its
 * stripped form; a sealed node by its inner pattern, sealed again; a seq
 * combinator element by element, keeping its brand and its `to`.
 *
 * @typeParam P pattern node
 * @typeParam S shape at the node's position
 * @typeParam Key key of the position; empty at the root
 */
export type BindNode<P, S, Key extends string> = P extends {
  readonly [FLUENT_INNER]: infer N
}
  ? BindNode<N, S, Key>
  : P extends { readonly [SEQ_BRAND]: infer Elements }
    ? Elements extends readonly unknown[]
      ? {
          readonly [SEQ_BRAND]: BindSeqElements<Elements, S>
          to: P extends { to: infer T } ? T : never
        }
      : P
    : P extends { readonly [OR_BRAND]: true }
      ? BindNode<StripOr<P>, S, Key>
      : P extends Sealed<infer _Inner>
        ? Sealed<BindValue<StripSeal<P>, S, Key>>
        : BindValue<P, S, Key>
