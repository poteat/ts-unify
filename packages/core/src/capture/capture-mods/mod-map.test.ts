import AssertType from '@/test-utils/assert-type'

import type { ModMap } from './mod-map'

describe('mod-map', () => {
  it('carries a map field', () => {
    type M = ModMap<number>
    AssertType.assertType<M, { map: number }>(0)
  })
})
