import type { TSESTree } from '@typescript-eslint/types'

/**
 * What one comment's node is read against: its program, the declarations
 * by start offset, the token starts, and whether it is the header.
 */
export type CommentSetting = {
  parent: TSESTree.Program
  starts: ReadonlyMap<number, TSESTree.Node>
  tokenStarts: readonly number[]
  isHeader: boolean
}
