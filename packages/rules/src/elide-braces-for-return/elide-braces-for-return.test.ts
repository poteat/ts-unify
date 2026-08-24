import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { elideBracesForReturn } from './elide-braces-for-return'

describe('elide-braces-for-return', () => {
  it('types the return argument as an Expression', () => {
    type Bag = ExtractCaptures<(typeof elideBracesForReturn)['from']>
    AssertType.assertType<Bag, { argument: TSESTree.Expression }>(0)
  })
})
