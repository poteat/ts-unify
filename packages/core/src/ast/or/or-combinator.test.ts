import type { FluentNode } from '@/ast/fluent-node'
import type { OrCombinator } from '@/ast/or'
import type { Capture } from '@/capture'
import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

/**
 * A literal beside the string literals in the literal-form call.
 */
const ANSWER = 42 as const

describe('or-combinator', () => {
  it('unions branch node shapes and capture bags', () => {
    type N1 = { type: 'ReturnStatement'; argument: Capture<'a'> }
    type N2 = { type: 'IfStatement'; test: Capture<'t'> }

    function check(or: OrCombinator, b1: FluentNode<N1>, b2: FluentNode<N2>) {
      const union = or(b1, b2)
      type NodeShape = Omit<typeof union, 'when' | 'to'>
      type Bag = ExtractCaptures<NodeShape>
      void (0 as unknown as Bag)
    }

    void check
  })

  describe('literal form', () => {
    it('returns a plain union for literals-only', () => {
      function check(or: OrCombinator) {
        const union = or('a' as const, 'b' as const, ANSWER)
        type T = typeof union
        AssertType.assertType<T, 'a' | 'b' | 42>(0)
      }

      void check
    })

    it('ExtractCaptures works on union of literal and capture object', () => {
      type N1 = { tag: 'K'; value: Capture<'x'> }
      type Bag = ExtractCaptures<N1 | 'noop'>
      AssertType.assertType<Bag, {} | { x: unknown }>(0)
    })
  })
})
