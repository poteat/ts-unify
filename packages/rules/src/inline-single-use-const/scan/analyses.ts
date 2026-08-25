import Blocks from './blocks'
import Util from './util'

/**
 * The analyses of blocks, kept by the block's statement list.
 */
export const analyses = Util.memo(Blocks.analyze)
