import type { UnwrapFluent } from '@/ast/unwrap-fluent'

import type { OrNode, PrimitiveLiteral } from './types'

/**
 * A disjunction over its arguments, `U.or(a, b, ...)`.
 *
 * Over literals alone the result is their union. Over fluent nodes it is
 * a fluent node branded with `OR_BRAND` whose shape is the union of the
 * branches, so each branch keeps its own captures.
 */
export type OrCombinator = {
  <V1 extends PrimitiveLiteral, Rest extends readonly PrimitiveLiteral[]>(
    first: V1,
    ...rest: Rest
  ): V1 | Rest[number]

  <B1, Rest extends readonly unknown[]>(
    first: B1,
    ...rest: Rest
  ): OrNode<UnwrapFluent<B1> | UnwrapFluent<Rest[number]>>
}
