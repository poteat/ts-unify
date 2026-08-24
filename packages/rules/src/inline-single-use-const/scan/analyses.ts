import { analyze } from './analyze'
import { memo } from './memo'

/**
 * The analyses of blocks, kept by the block's statement list.
 */
export const analyses = memo(analyze)
