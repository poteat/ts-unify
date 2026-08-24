import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { elideBracesForReturn } from './elide-braces-for-return'

describe('elideBracesForReturn (type-level)', () => {
  it(
    'captures the return argument with Expression type (after ' +
      'defaultUndefined)',
    () => {
      type Bag = ExtractCaptures<(typeof elideBracesForReturn)['from']>
      AssertType.assertType<Bag, { argument: TSESTree.Expression }>(0)
    },
  )
})
