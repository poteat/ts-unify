import AssertType from '@/test-utils/assert-type'

import type { ModTruthy } from './mod-truthy'

describe('mod-truthy', () => {
  it('carries isTruthy: true', () => {
    type M = ModTruthy
    AssertType.assertType<M, { isTruthy: true }>(0)
  })
})
