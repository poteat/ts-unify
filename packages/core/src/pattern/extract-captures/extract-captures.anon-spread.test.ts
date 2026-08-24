import type { Capture, Spread } from '@/capture'
import AssertType from '@/test-utils/assert-type'

import type { ExtractCaptures } from './extract-captures'

describe('ExtractCaptures for anonymous sequence spread', () => {
  it('re-keys anonymous spread to the containing property key', () => {
    type Pattern = { body: readonly [Spread<''>, Capture<'x', number>] }
    type R = ExtractCaptures<Pattern>
    type Expected = { body: ReadonlyArray<unknown>; x: number }
    AssertType.assertType<R, Expected>(0)
  })
})
