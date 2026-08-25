import AssertType from '@/test-utils/assert-type'
import Fixtures from '@/wire/fixtures'

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

  it('names each provider declared but not listed', () => {
    AssertType.assertType<
      Missing<[typeof Fixtures.stamp]>,
      typeof Fixtures.clock | typeof Fixtures.settings
    >(0)
  })

  it('cannot tell two providers of one shape apart', () => {
    AssertType.assertType<
      Missing<[typeof Fixtures.one, typeof Fixtures.needsTwo]>,
      never
    >(0)
  })
})
