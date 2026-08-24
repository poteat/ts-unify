import ConfigType from '@/config/config-type'
import type { ConfigSlot } from '@/config/config-type'
import AssertType from '@/test-utils/assert-type'

import { C } from './config-slot'

describe('C (config slot factory)', () => {
  it('should create a config slot with the given name', () => {
    expect(C('theme').name).toBe('theme')
  })

  it('should set the CONFIG_BRAND to true', () => {
    expect(C('theme')[ConfigType.CONFIG_BRAND]).toBe(true)
  })

  it('should return a frozen object', () => {
    expect(Object.isFrozen(C('theme'))).toBe(true)
  })

  it('should preserve literal name type', () => {
    const slot = C('maxRetries')
    AssertType.assertType<typeof slot, ConfigSlot<'maxRetries', unknown>>(0)
  })

  it('should produce distinct objects for different names', () => {
    const a = C('a')
    const b = C('b')
    expect(a.name).not.toBe(b.name)
  })
})
