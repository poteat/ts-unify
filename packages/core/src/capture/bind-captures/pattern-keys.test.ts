import type { Capture } from '@/capture/capture-type'
import type { $ } from '@/capture/dollar'
import AssertType from '@/test-utils/assert-type'

import type { BindCaptures } from './bind-captures'

describe('pattern-keys', () => {
  it("omits fluent method keys like 'when'", () => {
    type Shape = { x: number }
    type Pattern = {
      x: Capture<'x'>
      when: (bag: never) => boolean
    }

    type R = BindCaptures<Pattern, Shape>
    AssertType.assertType<R, { readonly x: Capture<'x', number> }>(0)
  })

  it("omits fluent method keys like 'to'", () => {
    type Shape = { x: number }
    type Pattern = {
      x: Capture<'x'>
      to: (bag: never) => unknown
    }

    type R = BindCaptures<Pattern, Shape>
    AssertType.assertType<R, { readonly x: Capture<'x', number> }>(0)
  })

  it("binds only real shape keys and omits 'parent' from bound shape", () => {
    type Shape = { a: number }
    type P = { parent: { id: $ }; a: $ }
    type Bound = BindCaptures<P, Shape>
    type Expected = { readonly a: Capture<'a', number> }
    AssertType.assertType<Bound, Expected>(0)
  })
})
