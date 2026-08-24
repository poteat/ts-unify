import type { NodeByKind } from '@/ast/node-by-kind'
import type { NodeWithTruthy } from '@/ast/node-with-truthy'
import type { Capture } from '@/capture'
import AssertType from '@/test-utils/assert-type'
import type { KeysOfUnion } from '@/type-utils'

describe('node-with-truthy', () => {
  it('narrows the single capture to Truthy<...>', () => {
    type Node = {
      type: 'ReturnStatement'
      argument: Capture<'arg', string | 0 | null | ''>
    }
    type N = Node & NodeWithTruthy<Node>

    function check(n: N) {
      const narrowed = n.truthy()
      type ArgVal =
        Omit<typeof narrowed, 'truthy'>['argument'] extends Capture<
          'arg',
          infer V
        >
          ? V
          : never
      AssertType.assertType<ArgVal, string>(0)
    }

    void check
  })

  it('is not callable for zero- or multi-capture nodes', () => {
    type Zero = { type: 'X' } & NodeWithTruthy<{ type: 'X' }>
    type Many = {
      type: 'Y'
      a: Capture<'a'>
      b: Capture<'b'>
    } & NodeWithTruthy<{
      type: 'Y'
      a: Capture<'a'>
      b: Capture<'b'>
    }>

    function check(z: Zero, m: Many) {
      // @ts-expect-error: zero-capture nodes are gated out
      z.truthy()
      // @ts-expect-error: multi-capture nodes are gated out
      m.truthy()
    }

    void check
  })

  it("collides with no AST node data field named 'truthy'", () => {
    type U = NodeByKind[keyof NodeByKind]
    type AllKeys = KeysOfUnion<U>
    type HasTruthy = 'truthy' extends AllKeys ? true : false
    AssertType.assertType<HasTruthy, false>(0)
  })
})
