import type { TSESTree } from '@typescript-eslint/types'

import type { NormalizeBag } from '@/ast/normalize-bag'
import AssertType from '@/test-utils/assert-type'

describe('normalize-bag', () => {
  it('normalizes each entry using NormalizeCaptured', () => {
    type Bag = {
      a: { type: 'Literal' }
      b: { type: 'ReturnStatement' }
    }
    type NB = NormalizeBag<Bag>
    type A = NB['a']
    type B = NB['b']
    AssertType.assertType<A, TSESTree.Expression>(0)
    AssertType.assertType<B, TSESTree.Statement>(0)
  })
})
