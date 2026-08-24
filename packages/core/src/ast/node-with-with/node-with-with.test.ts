import type { BuilderMap } from '@/ast'
import type { NodeWithWith } from '@/ast/node-with-with'
import type { Capture } from '@/capture'
import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

/**
 * The value `.with` writes over the capture `a`.
 */
const NEW_A = 123 as const

describe('node-with-with', () => {
  it('overwrites colliding keys and merges new keys into bag', () => {
    type N = {
      type: 'X'
      a: Capture<'a', number>
      b: Capture<'b', string>
    }
    type NW = NodeWithWith<N>

    function check(n: NW) {
      const merged = n.with((_bag: { a: number; b: string }) => ({
        a: NEW_A,
        isAdded: true as const,
      }))

      type NodePart = Omit<typeof merged, 'with'>
      type AVal = NodePart['a'] extends Capture<'a', infer V> ? V : never
      AssertType.assertType<AVal, 123>(0)

      type Bag = ExtractCaptures<typeof merged>
      AssertType.assertType<Bag, { a: 123; b: string; isAdded: true }>(0)
    }

    void check
  })

  describe('with U.or', () => {
    it('composes .with after U.or; the bag gains the key', () => {
      function check(U: BuilderMap) {
        const merged = U.or(U.EmptyStatement(), U.EmptyStatement()).with(
          () => ({ foo: 'foo' as const }),
        )
        type Bag = ExtractCaptures<typeof merged>
        AssertType.assertType<Bag, { foo: 'foo' }>(0)
      }

      void check
    })

    it('merges two .with calls on one matcher (distinct keys)', () => {
      function check(U: BuilderMap) {
        const merged = U.EmptyStatement()
          .with(() => ({ foo: 'foo' as const }))
          .with(() => ({ bar: 'bar' as const }))
        type Bag = ExtractCaptures<typeof merged>
        AssertType.assertType<Bag, { foo: 'foo'; bar: 'bar' }>(0)
      }

      void check
    })
  })
})
