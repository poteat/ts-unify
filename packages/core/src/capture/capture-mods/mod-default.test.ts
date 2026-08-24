import AssertType from '@/test-utils/assert-type'

import type { ModDefault } from './mod-default'

describe('mod-default', () => {
  it('carries a default field', () => {
    type M = ModDefault<42>
    AssertType.assertType<M, { default: 42 }>(0)
  })
})
