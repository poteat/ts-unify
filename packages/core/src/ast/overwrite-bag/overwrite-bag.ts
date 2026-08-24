import type { NormalizeBag } from '@/ast/normalize-bag'
import type { ExtractCaptures } from '@/pattern'
import type { Overwrite } from '@/type-utils'

/**
 * The capture bag after `.with`: the node's bag with the new bag's
 * normalized entries written over it.
 */
export type OverwriteBag<Node, NewBag> = Overwrite<
  ExtractCaptures<Node>,
  NormalizeBag<NewBag>
>
