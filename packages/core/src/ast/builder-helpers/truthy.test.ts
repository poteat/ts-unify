import type { NodeWithWhen } from '@/ast/node-with-when'
import type { Capture } from '@/capture'
import AssertType from '@/test-utils/assert-type'

import type { Truthy, TruthyGuard } from './truthy'

describe('truthy guard (type-level)', () => {
  it('excludes falsy primitives from unions', () => {
    type T = string | 0 | 0n | '' | null | undefined | false
    type R = Truthy<T>
    AssertType.assertType<R, string>(0)
  })

  it('narrows single-capture nodes via .when(truthy)', () => {
    type Node = {
      type: 'ReturnStatement'
      argument: Capture<'arg', string | null | 0 | ''>
    }
    type NW = NodeWithWhen<Node>

    function check(n: NW, truthy: TruthyGuard) {
      const narrowed = n.when(truthy)
      type ArgVal =
        Omit<typeof narrowed, 'when'>['argument'] extends Capture<
          'arg',
          infer V
        >
          ? V
          : never
      AssertType.assertType<ArgVal, string>(0)
    }

    void check
  })
})
