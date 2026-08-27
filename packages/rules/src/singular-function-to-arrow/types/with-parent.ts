import type { TSESTree } from '@typescript-eslint/types'

/**
 * A match bag read for its `parent` slot: the node holding the function,
 * none at the top of a file.
 */
export type WithParent = { parent?: TSESTree.Node | null }
