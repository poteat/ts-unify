import type { Capture, $ } from '@/capture'
import AssertType from '@/test-utils/assert-type'

import type { CaptureLike } from './capture-like'

describe('capture-like', () => {
  it('default CaptureLike is $ | Capture<string, unknown>', () => {
    type U = $ | Capture
    AssertType.assertType<CaptureLike, U>(0)
    AssertType.assertType<U, CaptureLike>(0)
  })
})
