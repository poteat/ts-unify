import type { $ as DollarFn, Spread, DollarObjectSpread } from '@/capture'
import type { Capture } from '@/capture/capture-type'
import type { FluentCapture } from '@/capture/fluent-capture'
import AssertType from '@/test-utils/assert-type'

import { $ } from './dollar'

describe('$ type alias', () => {
  it('exports a function type compatible with typeof $', () => {
    type FnFromType = DollarFn
    type FnFromValue = typeof $
    AssertType.assertType<FnFromType, FnFromValue>(0)
    AssertType.assertType<FnFromValue, FnFromType>(0)
  })

  it('supports explicit Value generic parameter', () => {
    const capture = $<'id', number>('id')
    type C = typeof capture
    type Expected = Capture<'id', number> &
      Iterable<Spread<'id', number>> &
      DollarObjectSpread &
      FluentCapture<'id', number>
    AssertType.assertType<C, Expected>(0)
  })

  it('defaults Value generic parameter to unknown', () => {
    const capture = $('name')
    type C = typeof capture
    type Expected = Capture<'name', unknown> &
      Iterable<Spread<'name', unknown>> &
      DollarObjectSpread &
      FluentCapture<'name', unknown>
    AssertType.assertType<C, Expected>(0)
  })
})
