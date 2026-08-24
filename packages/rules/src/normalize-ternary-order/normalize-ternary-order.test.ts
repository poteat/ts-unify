import { AST_NODE_TYPES } from '@typescript-eslint/types'
import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { normalizeTernaryOrder } from './normalize-ternary-order'

describe('normalize-ternary-order', () => {
  it('captures ternary components and binary operator parts', () => {
    type Bag = ExtractCaptures<(typeof normalizeTernaryOrder)['from']>
    AssertType.assertType<Bag['condition'], TSESTree.Expression>(0)
    AssertType.assertType<Bag['consequent'], TSESTree.Expression>(0)
    AssertType.assertType<Bag['alternate'], TSESTree.Expression>(0)
    AssertType.assertType<
      Bag['operator'],
      TSESTree.BinaryExpression['operator']
    >(0)
    AssertType.assertType<Bag['left'], TSESTree.BinaryExpression['left']>(0)
    AssertType.assertType<Bag['right'], TSESTree.Expression>(0)
    AssertType.assertType<Bag['test'], TSESTree.Expression>(0)
    AssertType.assertType<Bag['type'], AST_NODE_TYPES.BinaryExpression>(0)
    AssertType.assertType<
      keyof Bag,
      | 'condition'
      | 'consequent'
      | 'alternate'
      | 'operator'
      | 'left'
      | 'right'
      | 'test'
      | 'type'
    >(0)
  })
})
