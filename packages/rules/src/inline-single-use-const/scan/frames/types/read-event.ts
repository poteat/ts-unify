import type { Node } from '@ts-unify/rules/inline-single-use-const/reads/tree'

import type { Frame } from './frame'

/**
 * One read of a name: the identifier's frame, the frames of the nested
 * blocks holding it, and the index of the block's statement it sits in.
 *
 * The nested frames come innermost first, each where the chain continues
 * past its statement.
 */
export type ReadEvent = {
  node: Node
  frame: Frame
  beyond: readonly Frame[]
  statement: number
}
