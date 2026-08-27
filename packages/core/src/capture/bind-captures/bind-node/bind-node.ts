import type FluentNodeTypes from '@/ast/fluent-node/types'
import type NodeWithSeqTypes from '@/ast/node-with-seq/types'
import type OrTypes from '@/ast/or/types'
import type { Sealed } from '@/ast/sealed'
import type { StripOr } from '@/pattern/strip-or'
import type { StripSeal } from '@/pattern/strip-seal'

import type { BindValue } from './bind-value'
import type Types from './types'

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
export type BindNode<P, S, Key extends string> =
  P extends FluentNodeTypes.FluentBranded<infer N>
    ? BindNode<N, S, Key>
    : P extends NodeWithSeqTypes.SeqBranded<infer Elements>
      ? Elements extends readonly unknown[]
        ? Types.BoundSeq<
            Elements,
            S,
            P extends Types.ToMember<infer T> ? T : never
          >
        : P
      : P extends OrTypes.OrBranded
        ? BindNode<StripOr<P>, S, Key>
        : P extends Sealed<infer _Inner>
          ? Sealed<BindValue<StripSeal<P>, S, Key>>
          : BindValue<P, S, Key>
