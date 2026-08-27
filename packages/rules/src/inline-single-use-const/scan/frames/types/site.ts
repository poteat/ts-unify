import type { Frame } from './frame'
import type { Suppressed } from './suppressed'

/**
 * Where a node stands under a statement: its frame, the index of the
 * block's statement it sits in, and the names suppressed there.
 */
export type Site = {
  frame: Frame
  statement: number
  suppressed: Suppressed | null
}
