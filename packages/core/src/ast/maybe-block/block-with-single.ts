import type { NodeByKind } from '@/ast/node-by-kind'
import type { WithoutInternalAstFields } from '@/type-utils'

/**
 * A block statement whose body is the one statement `S`.
 */
export type BlockWithSingle<S> = {
  type: NodeByKind['BlockStatement']['type']
  body: Readonly<[S]>
} & Omit<WithoutInternalAstFields<NodeByKind['BlockStatement']>, 'body'>
