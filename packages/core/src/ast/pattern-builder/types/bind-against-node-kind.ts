import type { NodeByKind } from '@/ast/node-by-kind'
import type { NodeKind } from '@/ast/node-kind'
import type { BindCaptures } from '@/capture'
import type { WithoutInternalAstFields } from '@/type-utils'

/**
 * The capture bag of a pattern `P` shaped like the AST node kind `K`,
 * each capture typed from the node's field.
 *
 * A comment's position is data, so on `Comment` its `loc` and `range`
 * bind too.
 */
export type BindAgainstNodeKind<P, K extends NodeKind> = BindCaptures<
  P,
  K extends 'Comment' ? NodeByKind[K] : WithoutInternalAstFields<NodeByKind[K]>
>
