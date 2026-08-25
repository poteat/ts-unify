import AssertType from '@/test-utils/assert-type'

import type { CAPTURE_MODS_BRAND } from './brand'
import type { CaptureMods } from './capture-mods'

describe('capture-mods', () => {
  it('brands with a Mods record', () => {
    type Tagged = CaptureMods<{ map: string }>
    type Val = Tagged[typeof CAPTURE_MODS_BRAND]
    AssertType.assertType<Val, { map: string }>(0)
  })
})
