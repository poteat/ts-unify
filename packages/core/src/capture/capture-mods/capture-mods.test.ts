import AssertType from '@/test-utils/assert-type'

import type { CaptureMods } from './capture-mods'
import { CAPTURE_MODS_BRAND } from './capture-mods-brand'

describe('capture-mods', () => {
  it('brands with a Mods record', () => {
    type Tagged = CaptureMods<{ map: string }>
    type Val = Tagged[typeof CAPTURE_MODS_BRAND]
    AssertType.assertType<Val, { map: string }>(0)
  })
})
