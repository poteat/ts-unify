import type { TSESTree } from '@typescript-eslint/types'

import type { NodeWithDefault } from '@/ast/node-with-default'
import type { Capture } from '@/capture'
import AssertType from '@/test-utils/assert-type'

describe('node-with-default', () => {
  it('provides default for single capture and applies to node shape', () => {
    type N = {
      type: 'ReturnStatement'
      argument: Capture<'arg', TSESTree.Expression | undefined>
    }
    type NM = NodeWithDefault<N>

    function check(n: NM, fallback: TSESTree.Identifier) {
      const withDefault = n.default(fallback)

      type NodePart = Omit<typeof withDefault, 'default'>
      type ArgValue =
        NodePart['argument'] extends Capture<'arg', infer V> ? V : never
      AssertType.assertType<ArgValue, TSESTree.Expression>(0)
    }

    void check
  })

  it('takes never when there are multiple captures', () => {
    type N = {
      type: 'X'
      aField: Capture<'a', TSESTree.Expression | undefined>
      bField: Capture<'b', TSESTree.Expression | undefined>
    }
    type NM = NodeWithDefault<N>

    type DefaultParam = NM['default'] extends (arg: infer A) => unknown
      ? A
      : unknown
    AssertType.assertType<DefaultParam, never>(0)
  })
})
