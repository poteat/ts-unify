import type { Sealed } from '@/ast/sealed'
import AssertType from '@/test-utils/assert-type'

import type { StripSeal } from './strip-seal'

describe('strip-seal', () => {
  it('unwraps Sealed brand', () => {
    type Inner = { type: 'ReturnStatement'; argument: unknown }
    type Wrapped = Sealed<Inner>
    type Result = StripSeal<Wrapped>
    AssertType.assertType<Result, Inner>(0)
  })

  it('returns non-sealed types unchanged', () => {
    type Plain = { type: 'Identifier'; name: string }
    type Result = StripSeal<Plain>
    AssertType.assertType<Result, Plain>(0)
  })

  it('returns primitives unchanged', () => {
    type Result = StripSeal<string>
    AssertType.assertType<Result, string>(0)
  })
})
