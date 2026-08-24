import type { BindCaptures, Capture } from '@/capture'
import AssertType from '@/test-utils/assert-type'

describe('BindCaptures skips function-valued keys in object patterns', () => {
  it("omits fluent method keys like 'when'", () => {
    type Shape = { x: number }
    type Pattern = {
      x: Capture<'x'>
      when: (bag: any) => boolean
    }

    type R = BindCaptures<Pattern, Shape>
    AssertType.assertType<R, { readonly x: Capture<'x', number> }>(0)
  })

  it("omits fluent method keys like 'to'", () => {
    type Shape = { x: number }
    type Pattern = {
      x: Capture<'x'>
      to: (bag: any) => unknown
    }

    type R = BindCaptures<Pattern, Shape>
    AssertType.assertType<R, { readonly x: Capture<'x', number> }>(0)
  })
})
