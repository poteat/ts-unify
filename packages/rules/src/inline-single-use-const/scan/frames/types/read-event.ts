import type { Node } from '@ts-unify/rules/inline-single-use-const/reads/tree'

import type { Frame } from './frame'

/**
 * One read of a name: the identifier's frame, the frames of the nested
 * blocks holding it (innermost first) where the chain continues past each
 * statement, and the index of the block's statement the read sits in.
 */
export type ReadEvent = {
  node: Node
  frame: Frame
  beyond: readonly Frame[]
  statement: number
}
