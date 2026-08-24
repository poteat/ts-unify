import type { FluentNode } from '@/ast/fluent-node'
import type { OR_BRAND } from '@/ast/or'
import type { UnwrapFluent } from '@/ast/unwrap-fluent'

import type { BlockWithSingle } from './block-with-single'

/**
 * `U.maybeBlock(stmt)`: matches the statement on its own or as the one
 * statement of a block, with the captures of either.
 */
export type MaybeBlockCombinator = <S>(stmt: S) => FluentNode<
  UnwrapFluent<S> | BlockWithSingle<UnwrapFluent<S>>
> & {
  readonly [OR_BRAND]: true
}
