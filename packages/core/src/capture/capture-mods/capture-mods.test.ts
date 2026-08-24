import AssertType from '@/test-utils/assert-type'

import { CAPTURE_MODS_BRAND } from './capture-mods'
import type {
  CaptureMods,
  ModMap,
  ModDefault,
  ModTruthy,
  ModWhen,
} from './capture-mods'

describe('CAPTURE_MODS_BRAND', () => {
  it('is a symbol', () => {
    expect(typeof CAPTURE_MODS_BRAND).toBe('symbol')
  })
})

describe('CaptureMods (type-level)', () => {
  it('brands with a Mods record', () => {
    type Tagged = CaptureMods<{ map: string }>
    type Val = Tagged[typeof CAPTURE_MODS_BRAND]
    AssertType.assertType<Val, { map: string }>(0)
  })
})

describe('Modifier shapes (type-level)', () => {
  it('ModMap carries a map field', () => {
    type M = ModMap<number>
    AssertType.assertType<M, { map: number }>(0)
  })

  it('ModDefault carries a default field', () => {
    type M = ModDefault<42>
    AssertType.assertType<M, { default: 42 }>(0)
  })

  it('ModTruthy carries truthy: true', () => {
    type M = ModTruthy
    AssertType.assertType<M, { truthy: true }>(0)
  })

  it('ModWhen carries a when field', () => {
    type M = ModWhen<string>
    AssertType.assertType<M, { when: string }>(0)
  })
})
