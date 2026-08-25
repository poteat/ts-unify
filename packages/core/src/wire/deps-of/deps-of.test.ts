import AssertType from '@/test-utils/assert-type'
import Fixtures from '@/wire/fixtures'

import type { DepsOf } from './deps-of'

describe('deps-of', () => {
  it('reads the tuple off the getter parameter', () => {
    AssertType.assertType<
      DepsOf<typeof Fixtures.stamp>,
      [typeof Fixtures.clock, typeof Fixtures.settings]
    >(0)
  })

  it('is empty for a provider that takes no getter', () => {
    AssertType.assertType<DepsOf<typeof Fixtures.clock>, []>(0)
  })

  it('distributes over a union of providers', () => {
    AssertType.assertType<
      DepsOf<typeof Fixtures.stamp | typeof Fixtures.twice>,
      | [typeof Fixtures.clock, typeof Fixtures.settings]
      | [typeof Fixtures.clock]
    >(0)
  })
})
