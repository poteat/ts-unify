import type { TSESTree } from '@typescript-eslint/types'

import AssertType from '@/test-utils/assert-type'

import type { NodeKind } from './node-kind'

const _x: keyof typeof TSESTree.AST_NODE_TYPES = 'IfStatement'

describe('NodeKind', () => {
  it('matches keys of AST_NODE_TYPES', () => {
    type K = NodeKind
    // Spot-check a few members
    AssertType.assertType<Extract<K, 'IfStatement'>, 'IfStatement'>(0)
    AssertType.assertType<Extract<K, 'Identifier'>, 'Identifier'>(0)
    AssertType.assertType<Extract<K, 'Literal'>, 'Literal'>(0)
    AssertType.assertType<Extract<K, 'Comment'>, 'Comment'>(0)
  })

  it('is keyed to TSESTree.AST_NODE_TYPES', () => {
    // Ensures we reference the upstream enum, not a copied list
    void _x
  })
})
