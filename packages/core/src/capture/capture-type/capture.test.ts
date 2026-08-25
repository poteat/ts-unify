import AssertType from '@/test-utils/assert-type'

import type { CAPTURE_BRAND } from './brand'
import type { Capture } from './capture'

describe('capture', () => {
  it('should preserve literal name types', () => {
    type TestCapture = Capture<'test'>
    type Name = TestCapture['name']
    AssertType.assertType<Name, 'test'>(0)
  })

  it('should have the brand property', () => {
    type TestCapture = Capture<'test'>
    type Brand = TestCapture[typeof CAPTURE_BRAND]
    AssertType.assertType<Brand, true>(0)
  })

  it('should default to string when no name provided', () => {
    type GenericCapture = Capture
    type Name = GenericCapture['name']
    AssertType.assertType<Name, string>(0)
  })
})
