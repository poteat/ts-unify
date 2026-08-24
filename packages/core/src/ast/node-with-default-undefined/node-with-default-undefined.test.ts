import type { TSESTree } from '@typescript-eslint/types'

import type { NodeWithDefaultUndefined } from '@/ast/node-with-default-undefined'
import type { Capture } from '@/capture'
import AssertType from '@/test-utils/assert-type'

describe('node-with-default-undefined', () => {
  it('defaults a single capture to undefined in the node shape', () => {
    type N = {
      type: 'ReturnStatement'
      argument: Capture<'arg', TSESTree.Expression | undefined>
    }
    type NM = NodeWithDefaultUndefined<N>

    function check(n: NM) {
      const withDefault = n.defaultUndefined()
      type NodePart = Omit<typeof withDefault, 'defaultUndefined'>
      type ArgValue =
        NodePart['argument'] extends Capture<'arg', infer V> ? V : never
      AssertType.assertType<ArgValue, TSESTree.Expression>(0)
    }

    void check
  })

  it('returns never when there are multiple captures', () => {
    type N = {
      type: 'X'
      aField: Capture<'a', TSESTree.Expression | undefined>
      bField: Capture<'b', TSESTree.Expression | undefined>
    }
    type NM = NodeWithDefaultUndefined<N>

    type Ret = NM['defaultUndefined'] extends () => infer R ? R : unknown
    AssertType.assertType<Ret, never>(0)
  })
})
