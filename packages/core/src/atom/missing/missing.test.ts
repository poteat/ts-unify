import Fixtures from '@/atom/fixtures'
import AssertType from '@/test-utils/assert-type'

import type { Missing } from './missing'

describe('missing', () => {
  it('is never for a complete tuple', () => {
    AssertType.assertType<
      Missing<
        [typeof Fixtures.clock, typeof Fixtures.settings, typeof Fixtures.stamp]
      >,
      never
    >(0)
  })

  it('names each slot read but filled by nothing', () => {
    AssertType.assertType<
      Missing<[typeof Fixtures.stamp]>,
      typeof Fixtures.Clock | typeof Fixtures.Settings
    >(0)
  })

  it('sees two alike slots as one type', () => {
    AssertType.assertType<
      Missing<[typeof Fixtures.one, typeof Fixtures.needsTwo]>,
      never
    >(0)
  })
})
