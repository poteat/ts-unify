import type { TSESTree } from '@typescript-eslint/types'

import AssertType from '@/test-utils/assert-type'
import type { WithoutInternalAstFields } from '@/type-utils'

describe('without-internal-ast-fields', () => {
  it('removes bookkeeping fields from a single node shape', () => {
    type Input = TSESTree.ReturnStatement
    type Result = WithoutInternalAstFields<Input>
    type Expected = Omit<Input, 'parent' | 'loc' | 'range'>
    AssertType.assertType<Result, Expected>(0)
  })

  it('distributes over a union of node shapes', () => {
    type Union = TSESTree.ReturnStatement | TSESTree.ConditionalExpression
    type Result = WithoutInternalAstFields<Union>
    type Expected =
      | WithoutInternalAstFields<TSESTree.ReturnStatement>
      | WithoutInternalAstFields<TSESTree.ConditionalExpression>
    AssertType.assertType<Result, Expected>(0)
  })
})
