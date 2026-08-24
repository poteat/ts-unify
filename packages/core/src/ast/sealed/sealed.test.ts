import type { Capture } from '@/capture'
import AssertType from '@/test-utils/assert-type'

import type { Sealed } from './sealed'

describe('sealed', () => {
  it('keeps the original fields at their types while adding a brand', () => {
    type Inner = { a: number; b: string }
    type S = Sealed<Inner>
    AssertType.assertType<S['a'], number>(0)
    AssertType.assertType<S['b'], string>(0)
  })

  it('marks a single-capture subtree whose fields stay reachable', () => {
    type Inner = { type: 'ReturnStatement'; argument: Capture<'x', number> }
    type S = Sealed<Inner>
    type Arg = S['argument']
    void (null as unknown as Arg)
  })
})
