import type { TSESTree } from '@typescript-eslint/types'

/**
 * A token as the attachment reads it: its range alone.
 */
export type RangedToken = { range: TSESTree.Range }
