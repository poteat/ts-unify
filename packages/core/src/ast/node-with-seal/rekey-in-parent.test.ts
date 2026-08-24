import type { Sealed } from '@/ast/sealed'
import type { Capture } from '@/capture'
import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

describe('Sealed re-keying across parent property (type-level)', () => {
  it('re-keys inner single capture to parent keys in IfStatement', () => {
    type Ret = {
      type: 'ReturnStatement'
      argument: Capture<'argument', unknown>
    }
    type Block = Sealed<{ type: 'BlockStatement'; body: readonly Ret[] }>
    type If = {
      type: 'IfStatement'
      test: Capture<'test', unknown>
      consequent: Block
      alternate: Block
    }
    type Bag = ExtractCaptures<If>
    AssertType.assertType<
      Bag,
      { test: unknown; consequent: unknown; alternate: unknown }
    >(0)
  })
})
