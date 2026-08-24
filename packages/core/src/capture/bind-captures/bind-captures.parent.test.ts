import type { BindCaptures, Capture, $ } from '@/capture'
import AssertType from '@/test-utils/assert-type'

describe("BindCaptures: ignores 'parent' key in object patterns", () => {
  it("binds only real shape keys and omits 'parent' from bound shape", () => {
    type Shape = { a: number }
    type P = { parent: { id: $ }; a: $ }
    type Bound = BindCaptures<P, Shape>
    type Expected = { readonly a: Capture<'a', number> }
    AssertType.assertType<Bound, Expected>(0)
  })
})
