import type { TSESTree } from '@typescript-eslint/types'

import AssertType from '@/test-utils/assert-type'

import type { NodeKind } from './node-kind'

const _x: keyof typeof TSESTree.AST_NODE_TYPES = 'IfStatement'

describe('node-kind', () => {
  it('has the members of AST_NODE_TYPES, spot-checked', () => {
    type K = NodeKind
    AssertType.assertType<Extract<K, 'IfStatement'>, 'IfStatement'>(0)
    AssertType.assertType<Extract<K, 'Identifier'>, 'Identifier'>(0)
    AssertType.assertType<Extract<K, 'Literal'>, 'Literal'>(0)
    AssertType.assertType<Extract<K, 'Comment'>, 'Comment'>(0)
  })

  it('is keyed to the upstream enum TSESTree.AST_NODE_TYPES', () => {
    void _x
  })
})
