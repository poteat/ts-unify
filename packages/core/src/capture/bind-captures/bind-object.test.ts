import type { Capture } from '@/capture/capture-type'
import type { $ } from '@/capture/dollar'
import type { DollarObjectSpread } from '@/capture/dollar-spread'
import AssertType from '@/test-utils/assert-type'

import type { BindCaptures } from './bind-captures'

describe('bind-object', () => {
  it('binds omitted keys when using { ...$, explicit: $ }', () => {
    type Shape = { a: number; b: string }
    type Pattern = { a: $ } & DollarObjectSpread
    type Bound = BindCaptures<Pattern, Shape>
    type Expected = {
      readonly a: Capture<'a', number>
      readonly b: Capture<'b', string>
    }
    AssertType.assertType<Bound, Expected>(0)
  })

  it("does not capture 'type' from shape extras", () => {
    type Shape = { type: 'ReturnStatement'; a: number; b: string }
    type Pattern = { a: Capture<'a', number> } & DollarObjectSpread
    type Bound = BindCaptures<Pattern, Shape>
    type Expected = {
      readonly a: Capture<'a', number>
      readonly b: Capture<'b', string>
    }
    AssertType.assertType<Bound, Expected>(0)
  })
})
