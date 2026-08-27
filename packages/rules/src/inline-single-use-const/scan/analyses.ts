import Blocks from './blocks'
import Util from './util'

/**
 * Each block's analysis, built on its first read and kept by the block's
 * statement list; a nested block's analysis is read through it.
 */
export const analyses = Util.memo(Blocks.analyze)
