import type { CaptureLike } from '@/capture/capture-like'
import type { ConfigSlot } from '@/config/config-type'
import AssertType from '@/test-utils/assert-type'

import type { Capturable } from './capturable'

describe('capturable', () => {
  it('is T | CaptureLike<T> | ConfigSlot', () => {
    type T = string
    type Expected = string | CaptureLike<string> | ConfigSlot
    type Actual = Capturable<T>
    AssertType.assertType<Actual, Expected>(0)
    AssertType.assertType<Expected, Actual>(0)
  })
})
