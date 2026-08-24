import AssertType from '@/test-utils/assert-type'

import type { HasNever } from './has-never'

describe('has-never', () => {
  it('should return true for never', () => {
    type Result = HasNever<never>
    AssertType.assertType<Result, true>(0)
  })

  it('should return false for non-never types', () => {
    type Result = HasNever<string>
    AssertType.assertType<Result, false>(0)
  })

  it('should return false for union with never', () => {
    type Result = HasNever<string | never>
    AssertType.assertType<Result, false>(0)
  })

  it('should detect impossible intersections', () => {
    type Impossible = string & number
    type Result = HasNever<Impossible>
    AssertType.assertType<Result, true>(0)
  })
})
