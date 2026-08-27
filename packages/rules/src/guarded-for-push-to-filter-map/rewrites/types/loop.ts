import type { TSESTree } from '@typescript-eslint/types'

/**
 * What a guarded or skipped loop captures, with the filter's test.
 *
 * The statements around it, the array's name, the loop's binding and
 * source, the consts kept before the push, and the pushed value.
 */
export type Loop = {
  before: ReadonlyArray<TSESTree.Statement>
  after: ReadonlyArray<TSESTree.Statement>
  arrayName: string
  loopVar: TSESTree.BindingName
  source: TSESTree.Expression
  test: TSESTree.Expression
  consts: ReadonlyArray<TSESTree.Statement> | undefined
  pushValue: TSESTree.Expression | TSESTree.SpreadElement
}
