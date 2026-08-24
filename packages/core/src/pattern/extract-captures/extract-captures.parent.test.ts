import type { $ } from '@/capture'
import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

describe("ExtractCaptures: ignores 'parent' property (enforcement-only)", () => {
  it('extracts captures from nested parent pattern', () => {
    type P = { parent: { id: $ } }
    type Bag = ExtractCaptures<P>
    type Expected = { id: unknown }
    AssertType.assertType<Bag, Expected>(0)
  })
})
