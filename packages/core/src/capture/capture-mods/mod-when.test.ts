import AssertType from '@/test-utils/assert-type'

import type { ModWhen } from './mod-when'

describe('mod-when', () => {
  it('carries a when field', () => {
    type M = ModWhen<string>
    AssertType.assertType<M, { when: string }>(0)
  })
})
